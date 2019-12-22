const fs = require("fs");
const path = require("path");
const glob = require("glob");
const gm = require("gray-matter");

/**
 * convert
 *
 * {"key1": ["value1","value2"]}
 * to
 * {"key1": [value1,value2]}
 */
const _specialStringify = object => {
  let tagResult = [];
  Object.entries(object).forEach(([key, value], index) => {
    let temp = "";
    if (index === 0) temp += "{";
    temp += `"${key}": [${value.join(",")}]`;
    if (index === Object.keys(object).length - 1) temp += "}";
    tagResult.push(temp);
  });
  return tagResult.join(",");
};

/**
 *
 * @param {String} path 文章的放置 目录
 * @param {Number} pagesize 文章分页大小
 */
const main = (artipath = "articles", pagesize = 4) => {
  const posts = glob
    .sync(`${artipath}/**/*.md`)
    .map((filePath, index) => {
      const importName = `post_${index}`;
      return {
        filePath,
        importName,
        importPath: `const ${importName} = () => import("../../${filePath}")`,
        content: gm(fs.readFileSync(path.resolve(filePath), "utf8"), {
          excerpt_separator: "<!-- more -->"
        }).data
      };
    })
    .sort((p1, p2) => new Date(p2.content.date) - new Date(p1.content.date));

  /// 文章导入生成
  const importsResult = posts.map(p => p.importPath).join("\n");

  // 文章 categories 处理
  const categories = {};
  for (const post of posts) {
    if (post.content.categories === undefined) continue;
    if (categories[post.content.categories] === undefined) categories[post.content.categories] = [];
    categories[post.content.categories].push(post.importName);
  }
  const categoriesResult = `const categories = ${_specialStringify(categories)}`;

  // 文章 tags 处理
  const tags = {};
  for (const post of posts) {
    for (const tag of post.content.tags || []) {
      if (tags[tag] === undefined) tags[tag] = [];
      tags[tag].push(post.importName);
    }
  }
  const tagsResult = `const tags = ${_specialStringify(tags)}`;

  /// 文章分页处理
  const pagesResult = `const pages = ${JSON.stringify(
    require("lodash.chunk")(
      posts.map(p => String.raw`${p.importName}`),
      pagesize
    )
  ).replace(/"/g, "")}`;

  const result = `/* eslint-disable */

import { Post } from "./Post";

${importsResult}

${tagsResult} as unknown as {[key: string]: [Post]}

${categoriesResult} as unknown as {[key: string]: [Post]}

${pagesResult} as unknown as [[Post]]

export { tags, categories, pages };
`;

  return result;
};

module.exports = main;
