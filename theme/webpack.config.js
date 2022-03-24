require('webpack')
require('autoprefixer');
require('precss');
require('postcss-import')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
    entry: './source/js/index.js', output: {
        path: __dirname + '/bundle/', filename: 'index.js'
    },

    module: {
        rules: [{
            test: /\.css$/i, use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
        }, {test: /\.woff|\.woff2|\.svg|.eot|\.ttf/, use: ['url-loader?limit=8192']}, {
            test: /\.html$/i, use: [{
                loader: 'raw-loader',
            },],
        },]
        // { test: /\.css/, loader: ExtractTextPlugin.extract('style-loader', 'css!postcss'), include: __dirname },
        // { test: /\.woff|\.woff2|\.svg|.eot|\.ttf/, loader: 'url-loader?limit=8192' }
    }, plugins: [//new webpack.optimize.UglifyJsPlugin({ minimize: true }),
        //new ExtractTextPlugin('index.css')
        new MiniCssExtractPlugin()], watch: false
}
