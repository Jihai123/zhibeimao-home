"""Permission acceptance harness: proves each permission with a REAL business call.

Never prints or stores a credential. Emits:
  ops/permission-acceptance.json
  ops/permission-acceptance.md
"""
from __future__ import annotations

import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
from growthops import credentials_path, load_credentials, mask, safe_error  # noqa: E402
from fetch_analytics import ADAPTERS  # noqa: E402

RESULTS = []


def add(item, status, evidence, needed=""):
    RESULTS.append({"item": item, "status": status, "evidence": evidence, "authorization_needed": needed})


def sh(args, timeout=60):
    try:
        return subprocess.run(args, capture_output=True, text=True, timeout=timeout)
    except Exception as e:
        return subprocess.CompletedProcess(args, -1, "", type(e).__name__)


def github_token():
    try:
        p = subprocess.run(["git", "credential", "fill"],
                           input="protocol=https\nhost=github.com\n\n",
                           capture_output=True, text=True, timeout=15)
    except Exception:
        return None
    # Never expose stdout; only extract into memory.
    for line in (p.stdout or "").splitlines():
        if line.startswith("password="):
            return line.split("=", 1)[1]
    return None


def gh_api(path, tok):
    r = sh(["curl", "-sS", "--max-time", "45", "--retry", "2",
            "-H", "Authorization: Bearer " + tok,
            "-H", "Accept: application/vnd.github+json",
            "-H", "User-Agent: growth-ops-permissions",
            "-w", "\n__STATUS__%{http_code}",
            "https://api.github.com" + path])
    raw = r.stdout or ""
    import re
    m = re.search(r"__STATUS__(\d+)\s*$", raw)
    status = int(m.group(1)) if m else 0
    try:
        return status, json.loads(raw[: m.start()].strip() if m else raw.strip())
    except Exception:
        return status, {}


def main():
    tok = github_token()
    creds = load_credentials()

    # 1. GitHub identity + real read
    st, me = gh_api("/user", tok or "")
    add("GitHub 身份与 API 读取", "PASS" if st == 200 else "FAIL",
        "GET /user -> HTTP %d, login=%s" % (st, me.get("login", "n/a")))

    # 2. Token scopes via response header (never the token)
    r = sh(["curl", "-sSI", "--max-time", "30", "-H", "Authorization: Bearer " + (tok or ""),
            "-H", "User-Agent: growth-ops-permissions", "https://api.github.com/user"])
    scopes = [l.split(":", 1)[1].strip() for l in (r.stdout or "").splitlines()
              if l.lower().startswith("x-oauth-scopes:")]
    add("GitHub 令牌权限范围", "PASS" if scopes else "UNKNOWN",
        "X-OAuth-Scopes: %s" % (scopes[0] if scopes else "unavailable"))

    # 3. Real write permission on BOTH source repos
    for repo in ("zhibeimao-home", "mydaohang"):
        st, d = gh_api("/repos/Jihai123/" + repo, tok or "")
        perms = d.get("permissions") or {}
        add("GitHub 写权限 / " + repo, "PASS" if perms.get("push") else "FAIL",
            "HTTP %d, private=%s, push=%s, admin=%s" %
            (st, d.get("private"), perms.get("push"), perms.get("admin")))

    # 4. GitHub Issues write (ledger)
    st, d = gh_api("/repos/Jihai123/zhibeimao-home/issues/27", tok or "")
    add("GitHub 运营账本读取", "PASS" if st == 200 else "FAIL",
        "GET issue #27 -> HTTP %d, comments=%s" % (st, d.get("comments")))

    # 5. Vercel / production deploy chain for zhibeimao
    r = sh(["curl", "-sSL", "--max-time", "60", "-A", "Mozilla/5.0",
            "https://www.zhibeimao.com/api/docs"])
    html = r.stdout or ""
    add("指北猫 生产部署链路", "PASS" if "application/ld+json" in html else "FAIL",
        "GET /api/docs bytes=%d, structured_data=%s" % (len(html.encode("utf-8")),
                                                        "application/ld+json" in html))

    # 6. chatgpt5x production read (this origin is genuinely flaky; bounded retry
    #    distinguishes a transient transport failure from a real outage).
    guide, attempts, transient = "", 0, 0
    for attempts in range(1, 4):
        r = sh(["curl", "-sSL", "--max-time", "90", "-A", "Mozilla/5.0",
                "https://www.chatgpt5x.com/guides/ai-tools-or-api/"])
        guide = r.stdout or ""
        if "AI工具网页使用还是API接入" in guide:
            break
        transient += 1
        import time
        time.sleep(3)
    add("智享AI 生产页面读取", "PASS" if "AI工具网页使用还是API接入" in guide else "FAIL",
        "GET guide bytes=%d, attempts=%d, transient_failures=%d, status_marker=%s" %
        (len(guide.encode("utf-8")), attempts, transient,
         "AI工具网页使用还是API接入" in guide))

    # 7. SSH deploy permission (no key stored locally by default)
    r = sh(["ssh", "-o", "BatchMode=yes", "-o", "ConnectTimeout=8",
            "-o", "StrictHostKeyChecking=no", "-o", "UserKnownHostsFile=/dev/null",
            "root@156.227.233.149", "echo SSH_OK"], timeout=18)
    ssh_ok = "SSH_OK" in (r.stdout or "")
    add("智享AI 服务器 SSH 部署", "PASS" if ssh_ok else "BLOCKED",
        "ssh BatchMode -> %s" % safe_error(((r.stdout or "") + (r.stderr or ""))[:120]),
        needed="" if ssh_ok else "一次性：为部署账号安装 ed25519 公钥，并把私钥配置为 GitHub Actions Secret（或本机 0600 密钥文件）+ 提供 webroot 路径")

    # 8. Deploy secrets (names only)
    st, d = gh_api("/repos/Jihai123/mydaohang/actions/secrets", tok or "")
    names = [x["name"] for x in d.get("secrets", [])] if isinstance(d, dict) else []
    add("智享AI 自动部署密钥", "PASS" if any("DEPLOY" in n for n in names) else "BLOCKED",
        "Actions secrets names=%s" % (names or "none"),
        needed="" if any("DEPLOY" in n for n in names) else "一次性：在 GitHub 仓库 Secrets 中添加 DEPLOY_HOST / DEPLOY_USER / DEPLOY_SSH_KEY / DEPLOY_WEBROOT")

    # 9. Credential store hygiene
    p = credentials_path()
    add("本地凭据仓（脱敏）", "PASS" if p.exists() else "BLOCKED",
        "path=%s exists=%s; 值从不打印/入库" % (p.name, p.exists()),
        needed="" if p.exists() else "一次性：把只读凭据写入本机 ~/.workbuddy/growth-ops/credentials.json（0600）")

    # 10. Five analytics platforms - REAL calls, no fabricated data
    for fn in ADAPTERS:
        res = fn(creds, "verify")
        add("数据链路 / " + res["source"], res["status"], res["reason"],
            needed="" if res["status"] == "OK" else "一次性：按授权清单提供最小只读凭据")

    now = datetime.now(timezone.utc).isoformat()
    report = {"generated_at": now, "results": RESULTS,
              "counts": {s: sum(1 for r in RESULTS if r["status"] == s)
                         for s in sorted({r["status"] for r in RESULTS})}}
    (ROOT / "permission-acceptance.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    lines = ["# 权限验收清单", "", "生成时间(UTC)：%s" % now, "",
             "> 每项均通过真实业务调用验证；仅输出非敏感证据，密钥/Cookie/密码不出现在任何日志与报告中。", "",
             "| 项目 | 状态 | 实证证据 | 待授权事项 |", "|---|---|---|---|"]
    for r in RESULTS:
        lines.append("| %s | %s | %s | %s |" %
                     (r["item"], r["status"], r["evidence"].replace("|", "\\|"),
                      (r["authorization_needed"] or "—").replace("|", "\\|")))
    lines += ["", "**统计**：" + ", ".join("%s=%d" % kv for kv in report["counts"].items()), ""]
    (ROOT / "permission-acceptance.md").write_text("\n".join(lines), encoding="utf-8")

    for r in RESULTS:
        print("%-34s %-12s %s" % (r["item"], r["status"], r["evidence"][:110]))
    print("\ncounts:", report["counts"])
    print("written:", ROOT / "permission-acceptance.md")
    # Only credential-bearing fields are counted; public site URLs in the
    # template are deliberately excluded so "configured" is never misleading.
    sensitive_keys = {"token", "api_key", "secret_key", "access_token", "refresh_token",
                      "service_account_json_path", "private_key_path"}
    def filled(o):
        n = 0
        if isinstance(o, dict):
            for k, v in o.items():
                if str(k).startswith("_"):
                    continue
                n += (1 if (k in sensitive_keys and isinstance(v, str) and v.strip()) else 0) + filled(v)
        return n
    print("credential_fields_filled:", filled(creds),
          "(site URLs/hostnames in the template are non-secret and excluded)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
