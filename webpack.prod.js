var webpack = require('webpack');
var webpackMerge = require("webpack-merge");
var commonConfig = require("./webpack.common");
var cleanWebpackPlugin = require("clean-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var getThemeConfig = require('./theme');
var theme = getThemeConfig();


module.exports = webpackMerge(commonConfig, {
    devtool: "source-map",
    output: {
        publicPath: "./dist/",
    },
    module: {
        rules: [
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
                    publicPath: "../../"
                }),
            },
        ],
    },
    plugins: [
        new cleanWebpackPlugin(["dist"]),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production"),
            },
        }),

       /* new htmlWebpackPlugin({
            favicon: "./vendor/favicon.ico",
           /!* minify: {
                collapseBooleanAttributes: true,
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                // ignoreCustomComments: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                // keepClosingSlash: true,
                useShortDoctype: true,
            },
            template: "./index.html",*!/
            title: "Production",
        }),*/
    ],
})
