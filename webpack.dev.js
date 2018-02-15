const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  // start Webpack in a watch mode, so Webpack will rebuild the bundle on changes
  watch: true  
});