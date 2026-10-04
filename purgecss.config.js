// purgecss.config.js — run by scripts/purge-css.js after `jekyll build`.
// Content scanned: built HTML plus the JS that toggles classes at runtime
// (Bootstrap collapse/dropdown, theme toggle, toc/read-time scripts).
module.exports = {
    content: [
        "./_site/**/*.html",
        "./_site/js/*.js",
        "./_site/assets/lf-ui/*.js",
    ],
    // Purged in place, same paths in _site.
    css: [
        "./_site/assets/lf-ui/bootstrap.min.css",
        "./_site/assets/lf-ui/lf-theme.css",
        "./_site/assets/lf-ui/lf-components.css",
        "./_site/css/style.css",
        "./_site/assets/font-awesome/css/all.min.css",
    ],
    // @font-face is kept whole: families are referenced through CSS variables, which PurgeCSS cannot trace.
    fontFace: false,
    keyframes: true,
    safelist: {
        standard: [
            "show", "showing", "hiding", "collapse", "collapsing", "fade", "active", "disabled",
            "modal-open", "dark", "light",
            // Theme is set by js/theme.js, so these attributes never appear in built HTML.
            /data-bs-theme/, /data-theme/,
        ],
        greedy: [
            // Bootstrap JS adds these at runtime.
            /^dropdown/, /^navbar/, /^offcanvas/, /^tooltip/, /^popover/, /^bs-/,
        ],
        pattern: /^fa[-]|^svg-inline|^wa-|^site-|^content-|^card-|^feature-/,
    },
};
