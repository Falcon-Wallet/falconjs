/* eslint-disable */
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'inline-source-map',
  bail: true,
  entry: {
    injection: path.join(__dirname, 'src/injection.ts'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
};
