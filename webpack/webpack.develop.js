const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.config.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
    devMiddleware: {
      writeToDisk: true,
    },
    port: 3000,
    historyApiFallback: true,
  },
});
