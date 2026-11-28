"""Public, read-only SEO/UX audit for the two operated sites.

Usage: python ops/audit.py before.json
       python ops/audit.py after.json

Only performs GET requests against public URLs. No analytics data is invented.
"""
import json
import re
import subprocess
import sys
import datetime

URLS = [
    "https://www.zhibeimao.com/",
    "https://www.zhibeimao.com/api",
    "https://www.zhibeimao.com/api/docs",
    "https://www.zhibeimao.com/about",
    "https://www.chatgpt5x.com/",
    "https://www.chatgpt5x.com/guides/ai-tools-or-api/",
]

UA = "Mozilla/5.0 (compatible; GrowthAudit/1.0; +https://www.zhibeimao.com)"


def fetch(url, timeout=150):
    """Return (body, headers, fetch_meta). A timed-out curl yields a TRUNCATED
    body; never treat that as a valid baseline observation."""
    import os
    import tempfile

    fd, tmp = tempfile.mkstemp(prefix="growth-audit-")
    os.close(fd)
    r = subprocess.run(
        ["curl", "-sSL", "--max-time", str(timeout), "-A", UA, "-o", tmp,
         "-w", "%{http_code}|%{size_download}|%{time_total}", url],
        capture_output=True, text=True,
    )
    with open(tmp, encoding="utf-8", errors="replace") as f:
        body = f.read()
    os.remove(tmp)
    parts = r.stdout.strip().split("|") if r.returncode == 0 else []
    meta = {
        "fetch_complete": r.returncode == 0,
        "curl_returncode": r.returncode,
        "http_code": parts[0] if len(parts) == 3 else None,
        "download_bytes": int(parts[1]) if len(parts) == 3 else None,
        "fetch_seconds": float(parts[2]) if len(parts) == 3 else None,
        "curl_stderr": r.stderr.strip()[:200],
    }
    head = subprocess.run(
        ["curl", "-sSI", "-L", "--max-time", "60", "-A", UA, url],
        capture_output=True,
    ).stdout.decode("utf-8", "replace")
    return body, head, meta


def first(pattern, text, flags=re.I | re.S):
    m = re.search(pattern, text, flags)
    return m.group(1).strip() if m else None


def header_value(head, name):
    vals = re.findall(r"^%s:\s*(.*)$" % re.escape(name), head, re.I | re.M)
    return vals[-1].strip() if vals else None


def parse(url, body, head, meta):
    status_codes = re.findall(r"^HTTP/\S+\s+(\d+)", head, re.M)
    title = first(r"<title[^>]*>(.*?)</title>", body)
    desc = first(r'<meta\s+[^>]*name=["\']description["\'][^>]*content=["\'](.*?)["\']', body)
    if desc is None:
        desc = first(r'<meta\s+[^>]*content=["\'](.*?)["\'][^>]*name=["\']description["\']', body)
    canonical = first(r'<link\s+[^>]*rel=["\']canonical["\'][^>]*href=["\'](.*?)["\']', body)
    if canonical is None:
        canonical = first(r'<link\s+[^>]*href=["\'](.*?)["\'][^>]*rel=["\']canonical["\']', body)
    robots_meta = first(r'<meta\s+[^>]*name=["\']robots["\'][^>]*content=["\'](.*?)["\']', body)
    viewport = first(r'<meta\s+[^>]*name=["\']viewport["\'][^>]*content=["\'](.*?)["\']', body)
    lang = first(r"<html[^>]*\blang=[\"']([^\"']+)", body)
    h1s = re.findall(r"<h1[^>]*>(.*?)</h1>", body, re.I | re.S)
    h1_texts = [re.sub(r"<[^>]+>", "", h).strip() for h in h1s]
    jsonld = re.findall(r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', body, re.I | re.S)
    ld_types = []
    for block in jsonld:
        ld_types.extend(re.findall(r'"@type"\s*:\s*"([^"]+)"', block))
    imgs = re.findall(r"<img\b[^>]*>", body, re.I)
    img_no_alt = sum(1 for tag in imgs if not re.search(r"\balt=", tag, re.I))
    anchors = re.findall(r'<a\b[^>]*href=["\']([^"\']+)["\']', body, re.I)
    internal = sum(1 for h in anchors if h.startswith("/") or "zhibeimao.com" in h or "chatgpt5x.com" in h)
    external = len(anchors) - internal
    return {
        "url": url,
        "fetch": meta,
        "final_effective_url": header_value(head, "location") or url,
        "http_status_chain": status_codes,
        "server": header_value(head, "server"),
        "content_type": header_value(head, "content-type"),
        "last_modified": header_value(head, "last-modified"),
        "etag": header_value(head, "etag"),
        "bytes": len(body.encode("utf-8")),
        "lang": lang,
        "title": title,
        "title_len": len(title) if title else 0,
        "meta_description": desc,
        "meta_description_len": len(desc) if desc else 0,
        "canonical": canonical,
        "robots_meta": robots_meta,
        "viewport": viewport,
        "h1_count": len(h1s),
        "h1_texts": h1_texts[:5],
        "jsonld_blocks": len(jsonld),
        "jsonld_types": sorted(set(ld_types)),
        "img_total": len(imgs),
        "img_missing_alt": img_no_alt,
        "links_total": len(anchors),
        "links_internal": internal,
        "links_external": external,
        "has_jsonld_faq": any("FAQ" in t for t in ld_types),
        "has_og_title": bool(re.search(r'property=["\']og:title["\']', body, re.I)),
        "has_twitter_card": bool(re.search(r'name=["\']twitter:card["\']', body, re.I)),
        "has_baidu_analytics": "hm.js" in body,
        "has_ga4": bool(re.search(r"G-[A-Z0-9]{8,}", body)),
        "has_sitemap_link_in_robots": None,
        "_head_raw": head[-1200:],
    }


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "ops/audit-output.json"
    report = {
        "captured_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "method": "public GET via curl, read-only; no analytics backend access",
        "pages": [],
    }
    for url in URLS:
        body, head, meta = fetch(url)
        report["pages"].append(parse(url, body, head, meta))
        p = report["pages"][-1]
        print("audited", url, p["http_status_chain"], "bytes", p["bytes"],
              "complete", p["fetch"]["fetch_complete"], "secs", p["fetch"]["fetch_seconds"])
    for domain in ("https://www.zhibeimao.com", "https://www.chatgpt5x.com"):
        for path in ("/robots.txt", "/sitemap.xml"):
            b, h, meta = fetch(domain + path)
            report.setdefault("resources", []).append({
                "url": domain + path,
                "http_status_chain": re.findall(r"^HTTP/\S+\s+(\d+)", h, re.M),
                "bytes": len(b.encode("utf-8")),
                "fetch": meta,
                "body_head": b[:600],
            })
    with open(out, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print("WROTE", out)


if __name__ == "__main__":
    main()
