// Purge unused CSS from _site in place, then minify. Usage: node scripts/purge-css.js
const fs = require("fs");
const path = require("path");
const { PurgeCSS } = require("purgecss");
const { minify } = require("csso");
const config = require("../purgecss.config.js");

(async () => {
    const results = await new PurgeCSS().purge(config);
    for (const { file, css: purged } of results) {
        // restructure:false keeps rule order, so cascade behaviour is unchanged.
        const css = minify(purged, { restructure: false }).css;
        const before = fs.statSync(file).size;
        fs.writeFileSync(file, css);
        console.log(`${path.relative(".", file)}: ${before} -> ${Buffer.byteLength(css)} bytes`);
    }
})();
