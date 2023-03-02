const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const publicPath = path.resolve(__dirname, "../dist");

module.exports = {
  entry: {
    index: "./src/index.js",
  },
  output: {
    filename: "js/[name].bundle.js",
    path: publicPath,
    publicPath: "/",
  },
  plugins: [
    new Dotenv({
      path: ".env",
    }),
    new MiniCssExtractPlugin({
      linkType: "text/css",
      filename: "styles/[name].css",
      insert: "head",
    }),
    new HtmlWebpackPlugin({
      title: "ChitGold - Condensed chits which worth the gold",
      filename: "index.html",
      template: "./public/index.html",
      inject: "body",
      chunks: ["index"],
      hash: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "/",
            },
          },
          "css-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  optimization: {
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
  },
};
