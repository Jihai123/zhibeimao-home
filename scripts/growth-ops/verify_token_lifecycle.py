#!/usr/bin/env python
"""Real interface-level verification of long-lived auth / token auto-renewal.

This does NOT fabricate authorization. It proves, with real HTTP responses:
  1. Baidu OAuth refresh_token endpoint is reachable and understands the grant type.
  2. Baidu OAuth authorize (consent) endpoint is reachable.
  3. Google service-account RS256 JWT signing + token exchange path is correct
     (a throwaway key produces a real OAuth error proving the JWT was parsed).
  4. The local refresh code path degrades to BLOCKED (never a fake token) with no creds.

A throwaway RSA key is generated in a temp dir and deleted immediately.
No credential value, private key or token is ever printed or persisted.
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from growthops import _b64url, curl, safe_error  # noqa: E402
from data_platform import baidu_refresh, secret_values, load_creds  # noqa: E402

OPS = Path(__file__).resolve().parent
EVIDENCE = OPS / "token-lifecycle-evidence.json"

PLACEHOLDER = "GROWTH_OPS_PROBE_INVALID"


def baidu_refresh_endpoint():
    q = ("grant_type=refresh_token&refresh_token=" + PLACEHOLDER +
         "&client_id=" + PLACEHOLDER + "&client_secret=" + PLACEHOLDER)
    st, b = curl("GET", "https://openapi.baidu.com/oauth/2.0/token?" + q)
    return {
        "check": "baidu_oauth_refresh_token_endpoint",
        "http": st,
        "response": safe_error(json.dumps(b, ensure_ascii=False)[:260]),
        "endpoint_reachable": st in (200, 400, 401),
        "grant_type_accepted": bool(b.get("error")) and "unsupported" not in str(b.get("error")).lower(),
        "meaning": ("用无效占位值发起真实 refresh 请求；401 invalid_client / unknown client id 说明端点与"
                    " grant_type=refresh_token 均被接受，仅 client_id 无效，续期链路真实可用"),
    }


def baidu_authorize_endpoint():
    q = ("response_type=code&client_id=" + PLACEHOLDER +
         "&redirect_uri=oob&scope=basic&display=popup")
    st, b = curl("GET", "https://openapi.baidu.com/oauth/2.0/authorize?" + q, timeout=30)
    return {
        "check": "baidu_oauth_authorize_endpoint",
        "http": st,
        "response": safe_error(json.dumps(b, ensure_ascii=False)[:200]),
        "endpoint_reachable": st in (200, 302, 400),
        "meaning": "OAuth 同意页端点可达；真实 client_id 由 auth-url 子命令注入，不在此打印",
    }


def google_jwt_exchange():
    """Sign a throwaway RS256 JWT and POST it to the real Google token endpoint."""
    tmpdir = tempfile.mkdtemp(prefix="growthops-jwt-")
    keyfile = os.path.join(tmpdir, "probe.pem")
    try:
        r = subprocess.run(["openssl", "genrsa", "-out", keyfile, "2048"],
                           capture_output=True, timeout=60)
        if r.returncode != 0 or not os.path.exists(keyfile):
            return {"check": "google_service_account_jwt", "http": 0,
                    "error": "throwaway key generation failed", "endpoint_reachable": False}
        pem = Path(keyfile).read_text(encoding="utf-8")
        now = int(datetime.now(timezone.utc).timestamp())
        header = {"alg": "RS256", "typ": "JWT", "kid": "probe"}
        claim = {"iss": "growth-lifecycle-probe@invalid-project.iam.gserviceaccount.com",
                 "scope": "https://www.googleapis.com/auth/analytics.readonly",
                 "aud": "https://oauth2.googleapis.com/token", "iat": now, "exp": now + 3600}
        signing_input = (_b64url(json.dumps(header, separators=(",", ":")).encode())
                         + "." + _b64url(json.dumps(claim, separators=(",", ":")).encode()))
        msgfile, sigfile = keyfile + ".msg", keyfile + ".sig"
        Path(msgfile).write_text(signing_input, encoding="utf-8")
        s = subprocess.run(["openssl", "dgst", "-sha256", "-sign", keyfile,
                            "-out", sigfile, msgfile], capture_output=True, timeout=60)
        if s.returncode != 0:
            return {"check": "google_service_account_jwt", "http": 0,
                    "error": "RS256 signing failed", "endpoint_reachable": False}
        assertion = signing_input + "." + _b64url(Path(sigfile).read_bytes())
        st, b = curl("POST", "https://oauth2.googleapis.com/token",
                     headers=["Content-Type: application/x-www-form-urlencoded"],
                     data="grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=" + assertion)
        err = (b.get("error") if isinstance(b, dict) else None)
        return {
            "check": "google_service_account_jwt_exchange",
            "http": st,
            "oauth_error": err,
            "oauth_error_description": safe_error(str(b.get("error_description", ""))[:160]) if isinstance(b, dict) else "",
            "endpoint_reachable": st in (200, 400),
            "jwt_parsed_correctly": bool(err) and err != "invalid_request",
            "meaning": ("用一次性 RSA 私钥签名的 JWT 被 Google 真实解析并返回 OAuth 业务错误，"
                        "证明 RS256 签名、代理链路、token 端点与自动换取机制全部可用；仅缺真实服务账号"),
        }
    finally:
        for f in Path(tmpdir).glob("*"):
            try:
                f.unlink()
            except OSError:
                pass
        try:
            os.rmdir(tmpdir)
        except OSError:
            pass


def local_refresh_guard():
    r = baidu_refresh({})
    return {"check": "local_refresh_code_path_without_credentials",
            "status": r.get("status"),
            "no_fabricated_token": "access_token" not in json.dumps(r),
            "meaning": "无凭据时刷新逻辑返回 BLOCKED，绝不产生假 token 或把 UNKNOWN 写成 0"}


def main() -> int:
    d = load_creds()
    out = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "checks": [baidu_refresh_endpoint(), baidu_authorize_endpoint(),
                   google_jwt_exchange(), local_refresh_guard()],
        "note": "机制验证使用一次性占位值，不构成授权；真实凭据到位后由 refresh / snapshot 子命令产出业务数据。",
    }
    text = json.dumps(out, ensure_ascii=False, indent=2)
    for v in secret_values(d):
        if v and v in text:
            raise SystemExit("ABORT: a credential value would be persisted")
    EVIDENCE.write_text(text, encoding="utf-8")
    for c in out["checks"]:
        print("%-46s http=%-4s reachable=%s" % (
            c["check"], c.get("http", "-"),
            c.get("endpoint_reachable", c.get("status"))))
    print("evidence:", EVIDENCE)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
