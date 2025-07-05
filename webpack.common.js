const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pages = ["index"];

module.exports = {
    entry: pages.reduce((config, page) => {
        config[page] = `./src/js/${page}.js`;
        return config;
    }, {}),
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    resolve: {
        modules: [
            path.join(__dirname, "node_modules"),
        ]
    },
    

    plugins: [].concat(
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        pages.map(
            (page) =>
                new HtmlWebpackPlugin({
                    inject: true,
                    template: `./src/html/${page}.html`,
                    filename: `${page}.html`,
                    chunks: [page],
                }),
        )
    ),
};