const path = require("path");
const AiticlePlugin = require("./lib/article-plugin/index.ts");

// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [new AiticlePlugin()],
    module: {
      rules: [
        {
          test: /\.md$/,
          include: [path.resolve(__dirname, "articles")],
          use: ["md-loader"]
        }
      ]
    },
    resolveLoader: {
      alias: {
        "md-loader": path.resolve(__dirname, "./lib/article-loader/index.ts")
      }
    }
  }
};
