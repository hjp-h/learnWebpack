const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 导出配置 webpack 是在node的环境下运行的 需要用commonJS的方式
module.exports = {
  // 相对路径
  mode: 'development',
  // 方便定位错误与代码调试
  devtool:'source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'js/bundle.js'
    // assetModuleFilename : './img'  配置打包的静态资源存放路径
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // 简单写法 语法糖
        // loader:'css-loader'

        use: [
          // {loader:'css-loader',options:{}}
          // loader的顺序从后往前解析
          'style-loader',
          'css-loader',
          'postcss-loader',
          // 内部使用的方式
          // {
          //   loader: 'postcss-loader',
          //   options: {
          //     postcssOptions: {
          //       plugins: [
          //         require("autoprefixer")
          //       ]
          //     }
          //   }
          // }
        ]
      },
      {
        test: /\.less$/,
        use:[
          // less-loader 依赖less lessc能将.less文件转换成.css文件 安装less-loader 前还需要安装less
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      // webpac5 中file-loader url-loader已经废弃 
      // 出现的问题
      // （1）html 文件中引用的图片路径不正确，路径会包含文本 [object%20Module]
      // （2）一张图片打包后会生成两张，而且其中一张无法打开，html 文件中刚好引用的就是这张图片，也会导致图片无法正常显示
      // 下面是兼容的写法
      // {
      //   test: /\.(jpe?g|png|gif|svg|webp)$/,
      //   type:'javascript/auto',  // 不加这个配置，一张图片打包后会生成两张
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         // 指定目录
      //         // outputPath:'img',
      //         esModule: false,  // file-loader 默认使用 ES6 模块解析路径，将其关闭，启用 CommonJS 模块，不配置这个，html 文件中的图片路径不对
      //         name: "img/[name]_[hash:6].[ext]"
      //       },
      //     }
      //   ]
      // },
      // {
      //   test: /\.(jpe?g|png|gif|svg|webp)$/,
      //   type:'javascript/auto',  // 不加这个配置，一张图片打包后会生成两张
      //   use: [
      //     {
      //       loader: 'url-loader',
      //       options: {
      //         // 指定目录
      //         // outputPath:'img',
      //         esModule: false,  // file-loader 默认使用 ES6 模块解析路径，将其关闭，启用 CommonJS 模块，不配置这个，html 文件中的图片路径不对
      //         name: "img/[name]_[hash:6].[ext]",
      //         limit:100 * 1024
      //       },
      //     }
      //   ]
      // }
      
      // webpack5 的写法 包含了file-loader url-loader
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        type: 'asset',
        generator: {
          filename:'img/[name]_[hash:6][ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize:10 * 1024
          }
        }
      },

      // 字体图标的打包
      // {
      //   test: /\.(ttf|eot|woff2?)$/,
      //   type:'javascript/auto',
      //   use: [{
      //     loader: 'file-loader',
      //     options: {
      //       esModule: false,
      //       name:'font/[name]_[hash:6].[ext]'
      //     }
      //   }]
      // }
      {
        test: /\.(ttf|eot|woff2?)$/,
        type: 'asset/resource',
        generator: {
          filename:'font/[name]_[hash:6][ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize:100 * 1024
          }
        }
      },
      // babel转换js文件
      {
        test: /\.m?js$/,
        use: [{
          loader: 'babel-loader',
          // 内部配置的方式
          // options: {
          //   plugins: ['@babel/plugin-transform-arrow-functions', '@babel/plugin-block-scoping'],
          //   // presets:['@babel/preset-env']
          // }
        }]
      }
    ]
  },
  plugins: [
    // 每次打包清空原来的打包文件
    new CleanWebpackPlugin(),
    // html模板相关插件 
    new HtmlWebpackPugin({
      // 模板位置
      template: './public/index.html',
      // 传入模板中的参数
      title:'MY WEBPACK'
    }),
    // 定义全局的变量
    new DefinePlugin({
      BASE_URL:'"./"'
    }),
    // 复制public下的文件 排除掉html
    new CopyWebpackPlugin({
      patterns: [{
        from: 'public',
        // webpack默认会读取output路径 然后做个拼接
        to: './',
        // 忽略掉所有文件的index.html文件
        globOptions: {
          ignore: [
            '**/index.html'
          ]
        }
      }]
    })
  ]
}
