// https://www.xiaoyulive.top/favorite/docs/Plugins_Markdown_It.html#markdown-it-table-of-contents

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

function uslugify(s) {
  return require("uslug")(s);
}

const md = require("markdown-it")({
  highlight,
  html: true,
  typographer: true
})
  .use(require("markdown-it-anchor"), {
    permalink: true,
    permalinkBefore: true,
    permalinkSymbol: "",
    slugify: uslugify
  })
  .use(require("markdown-it-toc-done-right"), { slugify: uslugify })
  .use(require("markdown-it-sub"))
  .use(require("markdown-it-sup"))
  .use(require("markdown-it-ins"))
  .use(require("markdown-it-mark"))
  .use(require("markdown-it-mark"))
  .use(require("markdown-it-emoji"))
  .use(require("markdown-it-deflist"))
  .use(require("markdown-it-footnote"))
  .use(require("markdown-it-math"))
  .use(require("markdown-it-checkbox"))
  .use(require("markdown-it-texmath").use(require("katex")), {
    delimiters: "dollars",
    macros: { "\\RR": "\\mathbb{R}" }
  });

const matter = require("gray-matter");

module.exports = function(source, meta) {
  const result = matter(source, { excerpt_separator: "<!-- more -->" });
  if (result.content) result.contentHtml = md.render(result.content);
  if (result.excerpt) result.excerptHtml = md.render(result.excerpt);
  return `export default ${JSON.stringify(result)}`;
};
