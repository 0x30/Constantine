const hljs = require("highlight.js"); // https://highlightjs.org/

function highlight(str, lang) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return (
        '<pre class="hljs"><code>' +
        hljs.highlight(lang, str, true).value +
        "</code></pre>"
      );
    } catch (__) {}
  }

  return (
    '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
  );
}

const md = require("markdown-it")({ highlight, html: true });
const matter = require("gray-matter");

module.exports = function(source, meta) {
  const result = matter(source, { excerpt_separator: "<!-- more -->" });
  if (result.content) result.contentHtml = md.render(result.content);
  if (result.excerpt) result.excerptHtml = md.render(result.excerpt);
  return `export default ${JSON.stringify(result)}`;
};
