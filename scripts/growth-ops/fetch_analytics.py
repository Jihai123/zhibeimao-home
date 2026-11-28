"""Read-only operations data pipeline for the five analytics/search platforms.

Usage:
  python ops/fetch-analytics.py verify            # real API calls, proves auth works
  python ops/fetch-analytics.py snapshot         # write ops/snapshots/YYYY-MM-DD.json
  python ops/fetch-analytics.py submit-guide     # one-off Baidu URL submission (write, opt-in)

No credential value is ever printed, logged or written to a snapshot.
A missing credential is reported as BLOCKED; data is NEVER fabricated.
"""
from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote, urlencode

sys.path.insert(0, str(Path(__file__).parent))
from growthops import (  # noqa: E402
    curl, date_range, google_access_token, load_credentials, load_service_account,
    mask, result, safe_error,
)

ROOT = Path(__file__).resolve().parent
SNAPSHOT_DIR = ROOT / "snapshots"


def _cfg(creds, section):
    return creds.get(section) or {}


# --------------------------------------------------------------- 百度统计
def baidu_tongji(creds, mode="verify"):
    c = _cfg(creds, "baidu_tongji")
    sites = {k: v for k, v in (c.get("site_ids") or {}).items() if v}
    token = c.get("access_token")
    if not token and c.get("api_key") and c.get("secret_key"):
        q = urlencode({"grant_type": "client_credentials",
                       "client_id": c["api_key"], "client_secret": c["secret_key"]})
        st, b = curl("GET", "https://openapi.baidu.com/oauth/2.0/token?" + q)
        token = b.get("access_token") if st == 200 else None
    if not token:
        return result("baidu_tongji", "BLOCKED", "no access_token / API Key+Secret Key; complete OAuth in tongji.baidu.com -> 管理 -> 数据导出服务")
    if not sites:
        return result("baidu_tongji", "BLOCKED", "no site_ids configured")
    out = {}
    _, _, s, e = date_range(7)
    for name, site_id in sites.items():
        q = urlencode({"access_token": token, "site_id": site_id,
                       "method": "trend/time/a", "start_date": s, "end_date": e,
                       "metrics": "pv_count,visitor_count,new_visitor_count",
                       "gran": "day"})
        st, b = curl("GET", "https://openapi.baidu.com/rest/2.0/tongji/report/getData?" + q)
        if st == 200 and "error_code" not in b:
            out[name] = {"http": st, "rows": len((b.get("result") or {}).get("items") or [])}
        else:
            out[name] = {"http": st, "error": safe_error(json.dumps(b, ensure_ascii=False)[:200])}
    ok = all(v.get("http") == 200 and "error" not in v for v in out.values())
    return result("baidu_tongji", "OK" if ok else "ERROR",
                  "token=%s sites=%d" % (mask(token), len(sites)) if ok else "one or more site queries failed", out)


# --------------------------------------------------------------- GA4
def ga4(creds, mode="verify"):
    c = _cfg(creds, "ga4")
    sa = load_service_account(creds)
    props = {k: v for k, v in (c.get("property_ids") or {}).items() if v}
    if not sa:
        return result("ga4", "BLOCKED", "service account JSON missing/unreadable")
    if not props:
        return result("ga4", "BLOCKED", "no GA4 property_ids configured")
    token = google_access_token(sa, "https://www.googleapis.com/auth/analytics.readonly")
    if not token:
        return result("ga4", "BLOCKED", "service-account token exchange failed (check key, clock, or that Analytics Data API is enabled)")
    start, end, _, _ = date_range(7)
    body = json.dumps({"dateRanges": [{"startDate": start, "endDate": end}],
                       "metrics": [{"name": "activeUsers"}, {"name": "sessions"},
                                   {"name": "screenPageViews"}]})
    out = {}
    for name, pid in props.items():
        st, b = curl("POST", "https://analyticsdata.googleapis.com/v1beta/properties/%s:runReport" % pid,
                     headers=["Authorization: Bearer " + token, "Content-Type: application/json"],
                     data=body)
        out[name] = ({"http": st, "rows": len(b.get("rows") or []),
                      "totals": [t.get("values", [{}])[0].get("value") for t in (b.get("totals") or [])]}
                     if st == 200 else {"http": st, "error": safe_error(json.dumps(b, ensure_ascii=False)[:200])})
    ok = all(v.get("http") == 200 for v in out.values())
    return result("ga4", "OK" if ok else "ERROR",
                  "service_account=%s properties=%d" % (mask(sa.get("client_email")), len(props)) if ok else "runReport failed", out)


# --------------------------------------------------------------- GSC
def gsc(creds, mode="verify"):
    c = _cfg(creds, "gsc")
    sa = load_service_account(creds)
    sites = {k: v for k, v in (c.get("site_urls") or {}).items() if v}
    if not sa:
        return result("gsc", "BLOCKED", "service account JSON missing/unreadable")
    if not sites:
        return result("gsc", "BLOCKED", "no site_urls configured")
    token = google_access_token(sa, "https://www.googleapis.com/auth/webmasters.readonly")
    if not token:
        return result("gsc", "BLOCKED", "service-account token exchange failed (enable Search Console API)")
    start, end, _, _ = date_range(7)
    out = {}
    for name, site in sites.items():
        enc = quote(site, safe="")
        st, info = curl("GET", "https://www.googleapis.com/webmasters/v3/sites/" + enc,
                        headers=["Authorization: Bearer " + token])
        if st != 200:
            out[name] = {"http": st, "error": safe_error(json.dumps(info, ensure_ascii=False)[:200])}
            continue
        body = json.dumps({"startDate": start, "endDate": end,
                           "dimensions": ["date"], "type": "web", "rowLimit": 100})
        st2, q = curl("POST", "https://www.googleapis.com/webmasters/v3/sites/%s/searchAnalytics/query" % enc,
                      headers=["Authorization: Bearer " + token, "Content-Type: application/json"],
                      data=body)
        out[name] = ({"http": st2, "permissionLevel": info.get("permissionLevel"),
                      "rows": len(q.get("rows") or [])} if st2 == 200
                     else {"http": st2, "error": safe_error(json.dumps(q, ensure_ascii=False)[:200])})
    ok = all(v.get("http") == 200 for v in out.values())
    return result("gsc", "OK" if ok else "ERROR",
                  "sites=%d (service account must be Restricted User on each property)" % len(sites) if ok
                  else "site verification or query failed", out)


# --------------------------------------------------------------- Bing WMT
def bing_webmaster(creds, mode="verify"):
    c = _cfg(creds, "bing_webmaster")
    key = c.get("api_key")
    sites = {k: v for k, v in (c.get("site_urls") or {}).items() if v}
    if not key:
        return result("bing_webmaster", "BLOCKED", "no API key (bing.com/webmaster/home/api -> API Access)")
    st, b = curl("GET", "https://ssl.bing.com/webmaster/api.svc/json/GetUserSites?" + urlencode({"apikey": key}))
    if st != 200 or not isinstance(b, dict) or "d" not in b:
        return result("bing_webmaster", "ERROR", "GetUserSites failed", {"http": st, "error": safe_error(json.dumps(b, ensure_ascii=False)[:200])})
    verified = [x.get("Url") for x in b["d"] if x.get("IsVerified")]
    out = {"verified_sites": len(verified), "requested_sites": len(sites), "traffic": {}}
    for name, site in sites.items():
        st2, t = curl("GET", "https://ssl.bing.com/webmaster/api.svc/json/GetRankAndTrafficStats?"
                      + urlencode({"apikey": key, "siteUrl": site}))
        out["traffic"][name] = ({"http": st2, "days": len(t.get("d") or [])} if st2 == 200
                                else {"http": st2, "error": safe_error(json.dumps(t, ensure_ascii=False)[:160])})
    return result("bing_webmaster", "OK", "api_key=%s verified_sites=%d" % (mask(key), len(verified)), out)


# --------------------------------------------------------------- 百度搜索资源平台
def baidu_ziyuan(creds, mode="verify", submit=False):
    c = _cfg(creds, "baidu_ziyuan")
    token, site = c.get("token"), c.get("site")
    if not token or not site:
        return result("baidu_ziyuan", "BLOCKED", "no token/site (ziyuan.baidu.com -> 普通收录 -> API提交)")
    if not submit:
        return result("baidu_ziyuan", "NO_READ_API",
                      "百度搜索资源平台没有公开的流量/索引量读取 API；token 仅用于 URL 主动推送。流量数据以百度统计/GSC 为准，索引量需在平台后台导出。")
    url = "https://data.zz.baidu.com/urls?" + urlencode({"site": site, "token": token})
    st, b = curl("POST", url, headers=["Content-Type: application/json"],
                 data="https://www.chatgpt5x.com/guides/ai-tools-or-api/")
    ok = st == 200 and "success" in b
    return result("baidu_ziyuan", "OK" if ok else "ERROR",
                  "token=%s site=%s" % (mask(token), site),
                  {"http": st, "response_keys": sorted(b.keys()) if isinstance(b, dict) else []})


ADAPTERS = [baidu_tongji, ga4, gsc, bing_webmaster, baidu_ziyuan]


def run(mode):
    creds = load_credentials()
    out = [fn(creds, mode) for fn in ADAPTERS]
    return {"generated_at": datetime.now(timezone.utc).isoformat(),
            "mode": mode,
            "credentials_path": str(creds and "configured" or "missing (using defaults)"),
            "sources": out}


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "verify"
    if mode == "submit-guide":
        creds = load_credentials()
        print(json.dumps(baidu_ziyuan(creds, "verify", submit=True), ensure_ascii=False, indent=2))
        return 0
    report = run(mode)
    SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)
    out_file = SNAPSHOT_DIR / (datetime.now().strftime("%Y-%m-%d") + "-" + mode + ".json")

    # Hard guard: no credential value may ever appear in a persisted artifact.
    raw_creds = json.dumps(load_credentials(), ensure_ascii=False)
    values = []
    def collect(o):
        if isinstance(o, dict):
            for v in o.values(): collect(v)
        elif isinstance(o, str) and len(o) >= 8 and not o.startswith("_"):
            values.append(o)
    collect(json.loads(raw_creds))
    text = json.dumps(report, ensure_ascii=False)
    leaked = [v for v in values if v in text]
    if leaked:
        print("ABORT: a credential value would be persisted (%d matches); nothing written." % len(leaked))
        return 2

    out_file.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    for s in report["sources"]:
        print("%-18s %-12s %s" % (s["source"], s["status"], s["reason"]))
    print("snapshot:", out_file)
    ok = sum(1 for s in report["sources"] if s["status"] == "OK")
    print("summary: OK=%d BLOCKED=%d NO_READ_API=%d ERROR=%d TOTAL=%d"
          % (ok, sum(1 for s in report["sources"] if s["status"] == "BLOCKED"),
             sum(1 for s in report["sources"] if s["status"] == "NO_READ_API"),
             sum(1 for s in report["sources"] if s["status"] == "ERROR"), len(report["sources"])))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
