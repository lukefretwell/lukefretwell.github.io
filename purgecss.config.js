// purgecss.config.js

module.exports = {
    content: ["./_site/**/*.html"],
    css: ["./_site/css/style.css", "./_site/assets/font-awesome/css/all.min.css"],
    safelist: {
        pattern: /^fa[-]|^svg-inline|^wa-|^site-|^content-|^card-|^feature-/,
    },
};