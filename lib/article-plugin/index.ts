const fs = require("fs");
const path = require("path");
const lib = require("./lib/lib");
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

        watcher.on("add", path => this._2file(`新增 ${path}`)).on("unlink", path => this._2file(`删除 ${path}`));
      }
    });
  }

  /// read articles to posts.ts file
  _2file(reason) {
    console.log(`开始构建 ${reason}`);
    fs.writeFileSync("src/models/Posts.ts", lib(aiticlesPath, 3));
  }
}

module.exports = ArticleAutoLoaderPlugin;
