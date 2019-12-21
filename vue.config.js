const path = require("path");
const AiticlePlugin = require("./article-plugin/index.ts");

// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [new AiticlePlugin()],
    module: {
      rules: [
        {
          test: /\.md$/,
          include: [path.resolve(__dirname, "articles")],
          use: [
            {
              loader: path.resolve(__dirname, "./article-loader/index.ts")
            }
          ]
        }
      ]
    }
  }
};
