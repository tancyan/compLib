var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        vendor: [
            "react",
            "react-dom",
            "react-router"
        ],
        index: ["babel-polyfill", "./components/index.tsx"],
    },
    output: {
        filename: "static/js/[name].js",
        path: path.resolve(__dirname, "lib"),
    },
    module: {
        rules: [
            {
                test: /\.ts|tsx$/,
                loaders: ["babel-loader", "ts-loader"],
            },
            {
                test: /\.js?$/,
                exclude: /node_modules|lib/,
                loader: "babel-loader",
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                            outputPath: "static/images/",
                            name: "[hash:8].[name].[ext]"
                        },
                    },
                ],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                            outputPath: "static/fonts/",
                            name: "[name].[ext]"
                        },
                    },
                ],
            }
        ],
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            filename: "static/js/common.js",
            chunks: ['vendor', 'main']
        }),
        new ExtractTextPlugin({
            allChunks: true,
            filename: "static/css/[name].css",
        }),
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
}
