import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const entry = './source/js/index.js';
export const output = {
    path: __dirname + '/bundle/', filename: 'index.js'
};
export const module = {
    rules: [{
        test: /\.css$/i, use: [MiniCssExtractPlugin.loader, {
            loader: "css-loader", options: {
                // do not verify url() in css. We will have them in public folder
                url: false,
            },
        }, "postcss-loader"],
    }, { test: /\.woff|\.woff2|\.svg|.eot|\.ttf/, type: 'asset/inline' }, {
        test: /\.html$/i, type: 'asset/source',
    },]
};
export const plugins = [
    new MiniCssExtractPlugin({ filename: "index.css" })
];

const config = {
    entry,
    output,
    module,
    plugins,
    optimization: {
        minimizer: [
            `...`,
            new CssMinimizerPlugin(),
        ],
    },
};

export default config;