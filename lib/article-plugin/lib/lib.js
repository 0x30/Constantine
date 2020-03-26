const fs = require("fs");
const path = require("path");
const glob = require("glob");
const gm = require("gray-matter");

const chunk = require("lodash.chunk");
const { fnv32a } = require("../../util/hash.ts");

/**
 * convert
 *
 * {"key1": ["value1","value2"]}
 * to
 * {"key1": [value1,value2]}
 */
const _specialStringify = object => {
  let result = "{";
  Object.entries(object)
    .map(([key, value]) => `"${key}":${JSON.stringify(value).replace(/"/g, "")}`)
    .join(",");
  // for (const [key, value] of Object.entries(object)) {
  //   result += `"${key}":${JSON.stringify(value).replace(/"/g, "")},`;
  // }
  /// 去除多余的 ,
  result += Object.entries(object)
    .map(([key, value]) => `"${key}":${JSON.stringify(value).replace(/"/g, "")}`)
    .join(",");
  result += "}";

  return result;
};

/// 导入文件 处理
const importsHandle = posts => {
  return posts.map(p => `const ${p.importName} = () => ${p.importPath}`).join("\n");
};
/// 分页处理
const pagesHandle = (posts, pagesize) => {
  return `const pages = ${JSON.stringify(
    chunk(
      posts.map(p => String.raw`${p.importName}`),
      pagesize
    )
  ).replace(/"/g, "")}`;
};
/// 处理文章的 categorie 文件
const categorieHandle = (posts, pagesize) => {
  // 文章 categories 处理
  const categories = {};
  for (const post of posts) {
    if (post.content.categories === undefined) continue;
    if (categories[post.content.categories] === undefined) categories[post.content.categories] = [];
    categories[post.content.categories].push(post.importName);
  }
  for (const key of Object.keys(categories)) {
    categories[key] = chunk(categories[key], pagesize);
  }
  return `const categories = ${_specialStringify(categories)}`;
};
/// 标签处理
const tagsHanlde = (posts, pagesize) => {
  const tags = {};
  for (const post of posts) {
    for (const tag of post.content.tags || []) {
      if (tags[tag] === undefined) tags[tag] = [];
      tags[tag].push(post.importName);
    }
  }
  for (const key of Object.keys(tags)) {
    tags[key] = chunk(tags[key], pagesize);
  }
  return `const tags = ${_specialStringify(tags)}`;
};

/// 文章数据 标题 : 数据
const postData = posts => {
  let result = "const posts = {";
  result += posts.map(post => `"${post.content.id}": () => ${post.importPath}`).join(",");
  result += ",";
  result += posts.map(post => `"${post.content.title}": () => ${post.importPath}`).join(",");
  result += "}";
  return result;
};

/**
 *
 * @param {String} path 文章的放置 目录
 * @param {Number} pagesize 文章分页大小
 */
const main = (artipath = "articles", pagesize = 4) => {
  /// 文章列表
  const posts = glob
    .sync(`${artipath}/**/*.md`)
    .map((filePath, index) => {
      const importName = `post_${index}`;
      const postData = gm(fs.readFileSync(path.resolve(filePath), "utf8"), {
        excerpt_separator: "<!-- more -->"
      }).data;
      postData.id = fnv32a(postData.title).toString(16);
      return {
        filePath, // 文件目录
        importName, // 导入的对象 名称
        importPath: `import("../../${filePath}")`,
        content: postData // 文章 基础信息
      };
    })
    .sort((p1, p2) => new Date(p2.content.date) - new Date(p1.content.date));

  const result = `/* eslint-disable */
  import { Post } from "./Post";
  ${importsHandle(posts)}
  ${tagsHanlde(posts, pagesize)} as unknown as {[key: string]: [[Post]]}
  ${categorieHandle(posts, pagesize)} as unknown as {[key: string]: [[Post]]}
  ${pagesHandle(posts, pagesize)} as unknown as [[Post]]
  ${postData(posts)}
  export { tags, categories, pages, posts };
`;

  return result;
};

module.exports = main;
