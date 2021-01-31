const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HTMLPlugin = require("html-webpack-plugin");
const ExtractCssPlugin = require("mini-css-extract-plugin");


module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "[name].[contentHash].js",
    path: path.resolve(__dirname, "./dist")
  },

  resolve: {
    alias: {
      imgs: path.resolve(__dirname, 'src/images')
    } 
  },

  devServer: {
    contentBase: "./dist",
    // host: '192.168.0.22',
  },

  module: {
    rules: [
      {
        test: /\.sass$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },

      {
        test: /\.js$/,
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },

      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      
      {
        test: /\.(png|svg|jpe?g)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: "images"
          }
        } 
      }
    ]
  },


  plugins: [
    new CleanWebpackPlugin(),
    new HTMLPlugin({
      template: "./src/weather.html"
    })
  ]
}