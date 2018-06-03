var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var getThemeConfig = require('./theme');
var theme = getThemeConfig();
module.exports = {
    entry: {
        vendor: [
            "react",
            "react-dom",
            "react-router"
        ],
        app: ["babel-polyfill", "./tests/index.tsx"],
    },
    cache: false,
    devServer: {
        host: "127.0.0.1",
        hot: true,
        open: false,
        port: 9040,
        useLocalIp: false,
    },
    devtool: "source-map",

    output: {
        filename: "static/js/[name].js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/dist/",
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
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader",
                        options: {
                            sourceMap: true,
                            modifyVars: theme
                        },
                    }],
                    fallback: "style-loader",
                }),
            },
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
