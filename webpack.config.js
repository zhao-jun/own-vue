const path = require('path');
const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
// 动态插入bundle好的js到index.html
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const APP_PATH = path.resolve(__dirname, 'src'); // 项目的src目录路径
const APP_FILE = path.resolve(__dirname, 'src/index.js'); // 项目的入口文件（即src/index.jsx）
const BUILD_PATH = path.resolve(__dirname, 'build'); 

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'index.html',
    inject: true,
    minify: {
        removeComments: true,        //去注释
        collapseWhitespace: true,    //压缩空格
        removeAttributeQuotes: true  //去除属性引用
    }
});

module.exports = {
    devtool: 'cheap-module-eval-source-map',     
    entry: {
        bundle:[
            APP_FILE
        ]
    },
    output: {
        path: BUILD_PATH,
        filename: '[name][hash].js',
        publicPath:  '/'
    },
    module: {
        rules: [{
            test: /\.js$/, // 解析.js,用babel解析器，webpack会自动加载我们配置的.babelrc文件
            exclude: function(path) {
                // 路径中含有 node_modules 的就不去解析。
                var isNpmModule = !!path.match(/node_modules/);
                return isNpmModule;
            },
            use: ['babel-loader'],
            include: [APP_PATH]
        }, {
            test: /\.css$/, // 解析.css,先执行css-loader,再执行style-loader
            exclude: function(path) {
                // 路径中含有 node_modules 的就不去解析。
                var isNpmModule = !!path.match(/node_modules/);
                return isNpmModule;
            },
            use: ExtractTextPlugin.extract({
                fallback:'style-loader', 
                use:['css-loader', 'postcss-loader']
            }),
            include: [APP_PATH]
        }, {
            // 解析.less,先执行css-loader,再执行style-loader
            // 注意：连node_modules中的也一并解析(因为蚂蚁金服ui框架的样式文件就存在此目录下)
            test: /\.less$/, // 去掉exclude: /^node_modules$/和include: [APP_PATH]是为了babel-plugin-import按需加载mcwpadmin资源
            use: ExtractTextPlugin.extract({
                fallback:'style-loader', 
                use:['css-loader', 'postcss-loader', 'less-loader']
            })
        }, {
            // 其他各类文件处理，打包后会把这些文件挪到打包好的文件夹中
            test: /\.(eot|woff|svg|ttf|woff2|appcache)(\?|$)/,
            exclude: function(path) {
                // 路径中含有 node_modules 的就不去解析。
                var isNpmModule = !!path.match(/node_modules/);
                return isNpmModule;
            },
            use: ['file-loader?name=[name].[ext]'],
            include: [APP_PATH]
        }, {
             // 处理图片，这里配置的是，小于8192字节的图片变成base64编码，其余图片最终会生成一个images文件夹，存放其中
            test: /\.(png|jpg|gif)$/,
            exclude: function(path) {
                // 路径中含有 node_modules 的就不去解析。
                var isNpmModule = !!path.match(/node_modules/);
                return isNpmModule;
            },
            use: ['url-loader?limit=8192&name=images/[hash:8].[name].[ext]'],
            //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
            include: [APP_PATH]
        }, {
            test: /\.jsx$/, // 解析.jsx,用babel解析器，webpack会自动加载我们配置的.babelrc文件
            exclude: function(path) {
                // 路径中含有 node_modules 的就不去解析。
                var isNpmModule = !!path.match(/node_modules/);
                return isNpmModule;
            },
            use: ['jsx-loader', 'babel-loader'],
            include: [APP_PATH]
        }]
    },
    plugins: [
        HTMLWebpackPluginConfig,
        //热加载插件
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('style.css'),
        new OpenBrowserPlugin({ url: 'http://localhost:8080' })
    ],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src')
        }
    }
}
