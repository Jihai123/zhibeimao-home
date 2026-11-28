"""Shared, credential-safe plumbing for autonomous growth operations.

Design rules (do not weaken):
  * Credentials live ONLY in ~/.workbuddy/growth-ops/credentials.json (0600)
    or in environment variables. They are never written to the workspace,
    never printed, never included in snapshots/reports/GitHub comments.
  * Every public function returns only non-secret metadata and data.
  * A missing credential is BLOCKED, never a fabricated zero.
"""
from __future__ import annotations

import base64
import json
import os
import re
import subprocess
import tempfile
from datetime import date, timedelta
from pathlib import Path

DEFAULT_CREDENTIALS = Path.home() / ".workbuddy" / "growth-ops" / "credentials.json"
UA = "Mozilla/5.0 (compatible; GrowthOpsAudit/1.0)"


def credentials_path() -> Path:
    return Path(os.environ.get("GROWTH_OPS_CREDENTIALS", str(DEFAULT_CREDENTIALS)))


def load_credentials() -> dict:
    p = credentials_path()
    if not p.exists():
        return {}
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return {}


def mask(value) -> str:
    """Presence-only representation. Never returns the value itself."""
    if isinstance(value, dict):
        leaves = []
        def collect(o):
            if isinstance(o, dict):
                for k, v in o.items():
                    if not str(k).startswith("_"):
                        collect(v)
            elif isinstance(o, list):
                for v in o:
                    collect(v)
            elif isinstance(o, str) and o.strip():
                leaves.append(o)
        collect(value)
        return "CONFIGURED_FIELDS=%d" % len(leaves)
    if value is None or value == "" or value == []:
        return "MISSING"
    s = str(value)
    if s.startswith("-----BEGIN") or s.endswith(".json") or "/" in s or "\\" in s:
        return "SET(reference,len=%d)" % len(s)
    return "SET(len=%d)" % len(s)


def safe_error(text: str) -> str:
    """Strip anything that looks like a credential from an upstream error."""
    text = (text or "")[:300]
    text = re.sub(r"(apikey|api_key|access_token|token|secret|password|key)=[^&\s\"']+", r"\1=<REDACTED>", text, flags=re.I)
    text = re.sub(r"Bearer\s+[A-Za-z0-9._\-]+", "Bearer <REDACTED>", text)
    text = re.sub(r"[A-Za-z0-9._%+\-]{20,}@[A-Za-z0-9.\-]+", "<EMAIL_REDACTED>", text)
    return text


def curl(method: str, url: str, *, headers: list[str] | None = None,
         data: str | None = None, timeout: int = 45):
    """Return (http_status, parsed_json_or_text). Uses the machine's working proxy chain."""
    args = ["curl", "-sS", "--max-time", str(timeout), "--retry", "2",
            "--retry-delay", "1", "--retry-all-errors", "-A", UA,
            "-X", method, "-w", "\n__STATUS__%{http_code}"]
    for h in headers or []:
        args += ["-H", h]
    tmp = None
    if data is not None:
        fd, tmp = tempfile.mkstemp(prefix="growthops-body-")
        os.close(fd)
        Path(tmp).write_text(data, encoding="utf-8")
        args += ["--data-binary", "@" + tmp]
    args.append(url)
    try:
        r = subprocess.run(args, capture_output=True, text=True, timeout=timeout + 30)
    finally:
        if tmp:
            try:
                os.remove(tmp)
            except OSError:
                pass
    raw = r.stdout or ""
    m = re.search(r"__STATUS__(\d+)\s*$", raw)
    status = int(m.group(1)) if m else 0
    payload = raw[: m.start()].strip() if m else raw.strip()
    try:
        return status, json.loads(payload)
    except Exception:
        return status, {"raw": safe_error(payload)}


# ---------------------------------------------------------------------------
# Google service account: RS256 JWT signed with the local openssl binary.
# The private key is written to a 0600 temp file and deleted immediately.
# ---------------------------------------------------------------------------
def _b64url(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode().rstrip("=")


def google_access_token(sa: dict, scope: str) -> str | None:
    key = sa.get("private_key")
    email = sa.get("client_email")
    if not key or not email:
        return None
    now = int(subprocess.run(["date", "+%s"], capture_output=True, text=True).stdout.strip() or "0")
    if not now:
        import time
        now = int(time.time())
    header = {"alg": "RS256", "typ": "JWT", "kid": sa.get("private_key_id", "")}
    claim = {
        "iss": email, "scope": scope, "aud": "https://oauth2.googleapis.com/token",
        "iat": now, "exp": now + 3600,
    }
    signing_input = (_b64url(json.dumps(header, separators=(",", ":")).encode())
                     + "." + _b64url(json.dumps(claim, separators=(",", ":")).encode()))
    fd, keyfile = tempfile.mkstemp(prefix="growthops-sa-")
    os.close(fd)
    sigfile = keyfile + ".sig"
    msgfile = keyfile + ".msg"
    try:
        os.chmod(keyfile, 0o600)
        Path(keyfile).write_text(key, encoding="utf-8")
        Path(msgfile).write_text(signing_input, encoding="utf-8")
        r = subprocess.run(["openssl", "dgst", "-sha256", "-sign", keyfile,
                            "-out", sigfile, msgfile], capture_output=True, text=True)
        if r.returncode != 0:
            return None
        sig = Path(sigfile).read_bytes()
        assertion = signing_input + "." + _b64url(sig)
        status, body = curl("POST", "https://oauth2.googleapis.com/token",
                            headers=["Content-Type: application/x-www-form-urlencoded"],
                            data="grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=" + assertion)
        return body.get("access_token") if status == 200 else None
    finally:
        for f in (keyfile, sigfile, msgfile):
            try:
                os.remove(f)
            except OSError:
                pass


def load_service_account(cfg: dict) -> dict | None:
    p = (cfg.get("ga4") or {}).get("service_account_json_path", "")
    if not p or not Path(p).exists():
        return None
    try:
        return json.loads(Path(p).read_text(encoding="utf-8"))
    except Exception:
        return None


def date_range(days: int = 7):
    end = date.today() - timedelta(days=1)
    start = end - timedelta(days=days - 1)
    return start.isoformat(), end.isoformat(), start.strftime("%Y%m%d"), end.strftime("%Y%m%d")


def result(name: str, status: str, reason: str = "", data=None) -> dict:
    return {"source": name, "status": status, "reason": safe_error(reason), "data": data}
