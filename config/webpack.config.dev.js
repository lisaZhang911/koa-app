const webpackMerge = require('webpack-merge')

const baseWebConfig = require('./webpack.config.base')

const webpackConfig = webpackMerge(baseWebConfig,{
  devtool: 'eval-source-map',
  mode: 'development',
  stats: {children: false}
})

module.exports = webpackConfig
