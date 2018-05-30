const webpack = require("webpack");
const path = require("path");

const BUILD_DIR = path.resolve(__dirname, "./public");
const APP_DIR = path.resolve(__dirname, "./src/client");

const config = {
  context: __dirname,
  devtool: "cheap-eval-source-map",
  entry: {
    main: APP_DIR + "/ClientApp.jsx"
  },
  output: {
    filename: "bundle.js",
    path: BUILD_DIR
  },
  resolve: {
    extensions: [".js", ".jsx", "json"]
  },
  stats: {
    colors: true,
    reasons: true
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)?$/,
        loader: 'babel-loader'
      }
    ]
  }
};

module.exports = config;
