const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const utils = require('./utils')
const webpackconfig = {
  target: 'node',
  entry:{
    app: path.join(utils.APP_PATH, 'app.js')
  },
  output:{
    filename:'[name].bundle.js',
    path: path.join(utils.DIST_PATH,'dist')
  },
  devtool:'eval-source-map',
  module:{
    rules: [
      {
        test: /\.(js|jsx)$/,
        use:{
          loader: 'babel-loader'
        },
        exclude:[path.join(__dirname,'/node_modules')]
      }
    ]
  },
  externals: [nodeExternals()],
  plugins:[
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env':{
        NODE_ENV:(process.env.NODE_ENV === 'production' || process.env.NODE_ENV ==='prod')?"'production'":"'development'"
      }
    })
  ],
  node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filename: true,
    __dirname: true,
    setImmediated: true,
    path: true
  }
}

module.exports = webpackconfig
