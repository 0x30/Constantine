const path = require('path');

// vue.config.js
module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/,
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
