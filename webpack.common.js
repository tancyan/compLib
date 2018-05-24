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
        main: ["babel-polyfill", "./src/entry/Main.tsx"],
        style:path.join(__dirname, './src/entry/style/index.less'),
        bigData:["babel-polyfill", "./src/entry/BigData.tsx"],
        bdStyle:path.join(__dirname,"./src/entry/style/bigDataIndex.less")
    },
    output: {
        chunkFilename: "static/js/[name].[chunkhash].js",
        filename: "static/js/[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.ts|tsx$/,
                loaders: ["babel-loader", "ts-loader"],
            },
            {
                test: /\.js?$/,
                exclude: /node_modules|dist/,
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
