var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var ENTRY_PATH = path.resolve(ROOT_PATH, 'src/js/main.js');
var SRC_PATH = path.resolve(ROOT_PATH, 'src');
var JS_PATH = path.resolve(ROOT_PATH, 'src/js');
var ASSETS_PATH = path.resolve(ROOT_PATH, 'assets');
var TEMPLATE_PATH = path.resolve(ROOT_PATH, 'src/index.html');
var SHADER_PATH = path.resolve(ROOT_PATH, 'src/shaders');
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

var debug = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: ENTRY_PATH,
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'WebGL Game',
            template: TEMPLATE_PATH,
            inject: 'body'
        })
    ],
    output: {
        path: BUILD_PATH,
        filename: 'bundle.js'
    },
    resolve: {
        modules: [JS_PATH, SRC_PATH, ROOT_PATH]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: JS_PATH,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.glsl$/,
                include: SHADER_PATH,
                use: {
                    loader: 'webpack-glsl-loader'
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                include: ASSETS_PATH,
                use: {
                    loader: 'file-loader'
                }
            }
        ]
    }
};