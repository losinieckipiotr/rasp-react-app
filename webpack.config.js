var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var { CheckerPlugin } = require('awesome-typescript-loader');
var CleanWebpackPlugin = require('clean-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var webpack = require("webpack");

module.exports = function(env, argv) {
  var babelPresetEnv = [
    ['env', {
      "targets": {
        "browsers": ["last 2 versions"]
      },
    }]
  ];

  argv.p && babelPresetEnv.unshift('minify');

  var config = {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader',
          options: {
            "useCache": true,
            "useBabel": true,
            "babelOptions": {
                "babelrc": false,
                "presets": babelPresetEnv
            },
          },
        },
        {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          use: [
            {
              loader: 'file-loader',
              options: {}
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: [
      new CheckerPlugin(),
      new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery'
      }),
      new HtmlWebpackPlugin({
        title: 'My App',
        meta: { viewport: 'width=device-width, initial-scale=1' },
        favicon: './assets/my-icon.png',
      })
    ],
    devtool: argv.p ? false : 'source-map',
    entry: './src/index.tsx',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  };
  if (argv.p) {
    config.plugins.unshift(new CleanWebpackPlugin([path.resolve(__dirname, 'dist')]));
  }
  argv.analyze && config.plugins.unshift(new BundleAnalyzerPlugin());

  return config;
};
