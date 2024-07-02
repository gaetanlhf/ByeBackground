"use strict"

const path = require("path")
const autoprefixer = require("autoprefixer")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const dist = path.join(__dirname, "dist")
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/js/main.js",
    stats: {
        warnings: false
    },
    ignoreWarnings: [/./],
    output: {
        filename: "main.js",
        path: dist,
    },
    devServer: {
        static: path.resolve(__dirname, "dist"),
        port: 8080,
        hot: true,
        allowedHosts: "all"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new CopyPlugin({
            patterns: [{
                from: path.resolve(__dirname, "src/assets/models"),
                to: path.resolve(__dirname, "dist/models/")
            }, ]
        }),
        new CopyPlugin({
            patterns: [{
                from: path.resolve(__dirname, "src/assets/.htaccess"),
                to: path.resolve(__dirname, "dist/[name]")
            }, ]
        }),
        new CopyPlugin({
            patterns: [{
                from: path.resolve(__dirname, "src/assets/images/og.jpg"),
                to: path.resolve(__dirname, "dist/assets/images/[name]")
            }, ]
        }),
    ],
    module: {
        rules: [{
                test: /\.(gif|png|avif|jpe?g)$/,
                type: "asset/resource",
                generator: {
                    filename: "[name][ext]",
                    publicPath: "assets/images/",
                    outputPath: "assets/images/",
                },
            },
            {
                test: /\.html$/,
                use: [
                    "html-loader"
                ]
            },
            {
                test: /\.(scss)$/,
                use: [{
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    autoprefixer
                                ]
                            }
                        }
                    },
                    {
                        loader: "sass-loader"
                    }
                ],
            }
        ]
    }
}