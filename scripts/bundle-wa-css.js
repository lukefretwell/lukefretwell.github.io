// Flattens Web Awesome's chained @import stylesheets into a single file.
// The vendored dist-cdn build splits styles across dozens of small files
// linked via nested @import, which serializes into a deep discovery
// waterfall (each import level requires a round trip before the next can
// be requested). Bundling avoids that render-blocking chain.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'assets', 'webawesome', 'styles');
const ENTRY = path.join(ROOT, 'webawesome.css');
const OUT = path.join(ROOT, 'webawesome.bundled.css');

const seen = new Set();

function inline(filePath) {
  const resolved = path.resolve(filePath);
  if (seen.has(resolved)) return '';
  seen.add(resolved);
  const dir = path.dirname(resolved);
  const content = fs.readFileSync(resolved, 'utf8');
  const importRe = /@import\s+url\(['"]([^'"]+)['"]\);?/g;
  return content.replace(importRe, (match, url) => {
    if (/^https?:\/\//.test(url)) return match;
    return inline(path.join(dir, url));
  });
}

const bundled = inline(ENTRY);
fs.writeFileSync(OUT, bundled);
console.log(`Wrote ${path.relative(process.cwd(), OUT)} (${(bundled.length / 1024).toFixed(1)} KB, ${seen.size} files inlined)`);
