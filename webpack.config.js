const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const dotenv = require('dotenv');
const TerserPlugin = require("terser-webpack-plugin");

// Load environment variables from .env file
const env = dotenv.config().parsed || {};

module.exports = {
  target: "web",
  mode: "production",
  entry: {
    index: path.join(__dirname, "src/anima_assets/src/index.jsx"),
  },
  devtool: "source-map",
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: 'all',
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    fallback: {
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer/"),
      events: require.resolve("events/"),
      stream: require.resolve("stream-browserify/"),
      util: require.resolve("util/"),
    },
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.join(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env", 
              "@babel/preset-react",
              "@babel/preset-typescript"
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/anima_assets/src/index.html"),
      filename: "index.html",
      chunks: ["index"],
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        DFX_NETWORK: 'ic',
        NODE_ENV: 'production',
        CANISTER_ID_ANIMA: 'l2ilz-iqaaa-aaaaj-qngjq-cai',
        CANISTER_ID_ANIMA_ASSETS: 'lpp2u-jyaaa-aaaaj-qngka-cai',
      }),
    }),
  ],
};