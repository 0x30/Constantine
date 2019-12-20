const path = require("path");

// vue.config.js
module.exports = {
  configureWebpack: {
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
