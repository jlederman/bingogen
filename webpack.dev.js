const { merge } = require('webpack-merge');
const path = require('path');
const { DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const common = require('./webpack.common.js');

const API_URL = {
    development: JSON.stringify('//localhost:5000/')
}

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        headers: {
            'Access-Control-Allow-Private-Network': true,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': '*',
        },
        compress: true,
        allowedHosts: 'template.local',
        proxy: {
            '/post': {
                 target: 'http://localhost:5000/',
                 logLevel: 'debug' /*optional*/,
                 secure: false,
            }
         }
    },
    module: {
        rules: [
            {
                test: /\.(le|c)ss$/, // .less and .css
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: 'css-loader' },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                paths: [path.resolve(__dirname, "src/css")],
                            },
                        },
                    },
                ],
            },
        ]
    },
    plugins: [
        new DefinePlugin({
            'API_URL': API_URL.development
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),

    ]
})