const fs = require("fs");
const glob = require("glob");
const path = require("path");
const chokidar = require("chokidar");

const aiticlesPath = "articles/";

class ArticleAutoLoaderPlugin {
  apply(compiler) {
    compiler.hooks.afterPlugins.tap("ArticleAutoLoaderPlugin", () => {
      this._2file("初始化");

      if (process.env.NODE_ENV === "development") {
        const watcher = chokidar.watch(path.resolve(aiticlesPath), {
          ignored: /(^|[\/\\])\../,
          persistent: true,
          ignoreInitial: true
        });

        watcher
          .on("add", path => this._2file(`新增 ${path}`))
          .on("unlink", path => this._2file(`删除 ${path}`));
      }
    });
  }

  /// read articles to posts.ts file
  _2file(reason) {
    console.log(`开始构建 ${reason}`);

    let result = `/* eslint-disable */\nimport { Post } from "./Post";\n`;

    const posts = [];

    for (const [index, file] of glob.sync("articles/**/*.md").entries()) {
      const postIndexStr = `post_${index}`;
      posts.push(postIndexStr);
      result += `import ${postIndexStr} from "../../${file}";\n`;
    }

    const postString = JSON.stringify(posts).replace(/"/g, "");

    result += `
const posts = (${postString} as unknown) as [Post];

export { posts };`;

    fs.writeFileSync("src/models/Posts.ts", result);
  }
}

module.exports = ArticleAutoLoaderPlugin;
