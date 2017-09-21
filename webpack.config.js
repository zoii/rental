const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = (env) => {
  const __DEV__ = env.development; // eslint-disable-line
  const __PROD__ = env.production; // eslint-disable-line
  const PATHS = {
    app: path.join(__dirname, './app/client'),
    dist: path.join(__dirname, __DEV__ ? './app/client/public' : './app/client/dist'),
    publicPath: '/',
  };

  const config = {
    entry: [`${PATHS.app}/index`],
    output: {
      path: PATHS.dist,
      filename: 'app-[hash].js',
      publicPath: PATHS.publicPath,
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        assets: `${PATHS.app}/assets`,
      },
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader',
      }, {
        test: /\.(woff|woff2|ttf|otf|eot|svg)$/,
        loader: 'file-loader',
      }, {
        test: /\.(jpg|png|gif|svg)$/i,
        loader: 'file-loader?name=[name].[ext]',
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      }],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: `${PATHS.app}/assets/template.html`,
        inject: 'body',
      }),
    ],
  };

  if (__DEV__) {
    config.entry.push(
      'webpack-dev-server/client?http://localhost:7070',
      'webpack/hot/only-dev-server');
    config.devtool = 'inline-source-map';
    config.module.rules.push({
      test: /\.vue$/,
      loader: 'vue-loader',
    }, {
      test: /\.less$/i,
      use: ['style-loader', 'css-loader', 'less-loader'],
    });
    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(true),
      }),
      new WriteFilePlugin(),
      new webpack.HotModuleReplacementPlugin());
  }

  if (__PROD__) {
    config.module.rules.push({
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          css: ExtractTextPlugin.extract({
            use: 'css-loader',
            fallback: 'vue-style-loader', // <- 这是vue-loader的依赖，所以如果使用npm3，则不需要显式安装
          }),
        },
      },
    });
    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(false),
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      new ExtractTextPlugin('app-[hash].css'),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: '[name]-[hash].js',
        minChunks: module => (
          module.resource &&
          module.resource.indexOf('node_modules') !== -1 &&
          module.resource.indexOf('.css') === -1
        ),
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          unused: true,
          dead_code: true,
          warnings: false,
          screw_ie8: true,
        },
        comments: false,
      }));
  }

  config.devServer = {
    publicPath: PATHS.publicPath,
    contentBase: PATHS.dist,
    historyApiFallback: true,
    compress: true,
    inline: true,
    port: 7070,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  };
  return config;
};
