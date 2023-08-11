const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");


const isDEV = process.env.NODE_ENV === 'development'

module.exports = {
  devtool: isDEV ? 'inline-source-map' : undefined,
  mode: isDEV ? 'development' : 'production',
  entry: {
    background: './src/entry/background.ts',
    content: './src/entry/content.ts'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./public", to: "./" },
      ],
    }),
  ],
};