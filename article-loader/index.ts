var md = require("markdown-it")();
const matter = require("gray-matter");

module.exports = function(source, meta) {
  const result = matter(source, { excerpt_separator: "<!-- more -->" });
  if (result.content) result.contentHtml = md.render(result.content);
  if (result.excerpt) result.excerptHtml = md.render(result.excerpt);
  return `export default ${JSON.stringify(result)}`;
};
