const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.config.js");
const Dotenv = require("dotenv-webpack");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  plugins: [
    new Dotenv({
      path: ".env.development",
    }),
  ],
  devServer: {
    static: "./dist",
    devMiddleware: {
      writeToDisk: true,
    },
    port: 3000,
    historyApiFallback: true,
  },
});
