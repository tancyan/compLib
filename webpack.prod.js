var webpack = require('webpack');
var webpackMerge = require("webpack-merge");
var commonConfig = require("./webpack.common");
var cleanWebpackPlugin = require("clean-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var getThemeConfig = require('./theme');
var theme = getThemeConfig();


module.exports = webpackMerge(commonConfig, {
   // devtool: "source-map",
    output: {
        publicPath: "./lib/",
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
                            sourceMap: false,
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
        new cleanWebpackPlugin(["lib"]),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production"),
            },
        }),
    ],
})
