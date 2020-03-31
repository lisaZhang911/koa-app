const webpackMerge = require('webpack-merge')

const baseWebConfig = require('./webpack.config.base')
const TerserPlugin = require('terser-webpack-plugin')

const webpackConfig = webpackMerge(baseWebConfig,{
  devtool: 'eval-source-map',
  mode: 'production',
  stats: {children:false, warnings:false},
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 3,
          enforce: true
        }
      }
    }
  }
})

module.exports = webpackConfig
