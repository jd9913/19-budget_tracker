
const BundleAnalyzerPlugin=require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const path = require('path');
const webpack  = require('webpack');
const WebpackPwaManifest=require("webpack-pwa-manifest");


module.exports = {
  entry: './public/js/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].bundle.js'
   
   
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: "static", //the report outputs to an HTML file in the dist folder
    // }),
    new WebpackPwaManifest({
      name: "Budget Tracking App",
      short_name: "budget",
      description: "An app that allows you to track your money",
      start_url: "./public/index.html",
      background_color: "#01579b",
      theme_color: "#C0C0C0",
      fingerprints: false,
      inject: false,
      icons:[{
        src: path.resolve("./public/icons/icon-512x512.png"),
        sizes: [96,128,192,256,384,512],
        destination: path.join("icons")
      }],
    })
  ],
  mode: 'development'
};