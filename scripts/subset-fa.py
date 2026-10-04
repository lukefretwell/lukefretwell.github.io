#!/usr/bin/env python3
"""Subset the Font Awesome webfonts in _site to the icons the built pages use.

Run after `jekyll build`, before scripts/purge-css.js (which needs the full
icon->codepoint map in all.min.css). Needs: pip install fonttools brotli.
"""
import pathlib
import re
import sys

from fontTools import subset

SITE = pathlib.Path("_site")
FA = SITE / "assets/font-awesome"

css = (FA / "css/all.min.css").read_text()
# Aliases share a rule: `.fa-a,.fa-b{--fa:"\f08e"}`.
codepoints = {}
for selectors, code in re.findall(r'((?:\.fa-[a-z0-9-]+,?)+)\{--fa:"\\([0-9a-f]+)"', css):
    for name in selectors.split(","):
        codepoints[name.lstrip(".")] = int(code, 16)

used = set()
for path in list(SITE.rglob("*.html")) + list(SITE.glob("js/*.js")):
    used.update(re.findall(r"\bfa-[a-z0-9-]+", path.read_text(errors="ignore")))

unicodes = sorted({codepoints[n] for n in used if n in codepoints})
if not unicodes:
    sys.exit("subset-fa: no Font Awesome icons found in _site; refusing to empty the fonts")

for woff2 in sorted((FA / "webfonts").glob("fa-*-*.woff2")):
    before = woff2.stat().st_size
    opts = subset.Options(flavor="woff2", layout_features=["*"])
    font = subset.load_font(str(woff2), opts)
    subsetter = subset.Subsetter(opts)
    subsetter.populate(unicodes=unicodes)
    subsetter.subset(font)
    subset.save_font(font, str(woff2), opts)
    print(f"{woff2.name}: {before} -> {woff2.stat().st_size} bytes")
