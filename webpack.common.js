const path = require('path')

module.exports = {
  // the entry file for the bundle
  entry: path.join(__dirname, '/src/client/App.js'),

  // the bundle file we will get in the result
  output: {
    path: path.join(__dirname, '/build/'),
    filename: 'bundle.js',
  },

  module: {
    // apply loaders to files that meet given conditions
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  }
}
