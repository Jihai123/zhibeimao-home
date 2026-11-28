"""Daily growth-snapshot gate. Offline; reads only the audit JSON produced
by scripts/growth-seo-audit.py. Hard failures protect deployed invariants;
pending items are reported as WARN so a not-yet-authorized deploy never
produces fabricated success or a false red build.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path


def main() -> int:
    path = Path(sys.argv[1] if len(sys.argv) > 1 else "growth-snapshot.json")
    report = json.loads(path.read_text(encoding="utf-8"))
    required_errors: list[str] = []
    warnings: list[str] = []

    pages = report.get("pages") or []
    if len(pages) < 6:
        required_errors.append("expected 6 audited pages, got %d" % len(pages))

    for p in pages:
        url = p["url"]
        codes = p.get("http_status_chain") or []
        if "200" not in codes:
            required_errors.append("non-200 for %s: %s" % (url, codes))
        complete = (p.get("fetch") or {}).get("fetch_complete")
        if complete is False:
            required_errors.append("incomplete HTML for %s" % url)

        if "www.zhibeimao.com" in url:
            # The homepage emits ONE @graph block containing both site types,
            # while inner pages emit a second page-level block. Assert types,
            # not block counts, so the gate never produces a false regression.
            types = set(p.get("jsonld_types") or [])
            expected = {
                "https://www.zhibeimao.com/": {"Organization", "WebSite"},
                "https://www.zhibeimao.com/api": {"Organization", "WebSite", "WebPage", "BreadcrumbList"},
                "https://www.zhibeimao.com/api/docs": {"Organization", "WebSite", "TechArticle", "FAQPage", "BreadcrumbList"},
                "https://www.zhibeimao.com/about": {"Organization", "WebSite", "AboutPage", "BreadcrumbList"},
            }.get(url, {"Organization", "WebSite"})
            missing = sorted(expected - types)
            if missing:
                required_errors.append("structured data regressed on %s (missing %s)" % (url, ",".join(missing)))
            if not p.get("canonical"):
                required_errors.append("canonical missing on %s" % url)
            if not p.get("has_og_title"):
                required_errors.append("social card missing on %s" % url)

        if url.endswith("/guides/ai-tools-or-api/"):
            if p.get("jsonld_blocks", 0) < 1:
                warnings.append("chatgpt5x guide structured data not yet in production (deploy authorization pending)")
            if not p.get("has_ga4"):
                warnings.append("chatgpt5x guide measurement not yet in production (deploy authorization pending)")

    for r in report.get("resources") or []:
        if "200" not in (r.get("http_status_chain") or []):
            warnings.append("resource non-200: %s" % r.get("url"))

    print("snapshot:", report.get("captured_at_utc"), "pages:", len(pages))
    for p in pages:
        print("  %-58s http=%s jsonld=%s canonical=%s bytes=%s secs=%s" % (
            p["url"].replace("https://www.", ""), ",".join(p.get("http_status_chain") or []),
            p.get("jsonld_blocks"), "Y" if p.get("canonical") else "N",
            p.get("bytes"), round((p.get("fetch") or {}).get("fetch_seconds", 0), 2)))
    for w in warnings:
        print("WARN:", w)
    for e in required_errors:
        print("FAIL:", e)
    print("RESULT:", "FAIL" if required_errors else "PASS",
          "| hard_failures=%d warnings=%d" % (len(required_errors), len(warnings)))
    return 1 if required_errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
