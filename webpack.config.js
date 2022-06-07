const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {VueLoaderPlugin } = require('vue-loader/dist/index')
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
  // 监听模块变化 重新编译
  // watch:true,
  devServer: {
    // 这个配置项相当于当webpack编译找不到对应的文件时 默认会从contentbase里查找
    // contentBase: './contentBase',  (webpack4 webpack5改为static)
    static:'./contentBase',
    // 是否采用模块热更新 默认不知道哪个模块需要热替换
    hot: true,
    // 域名 默认是 localhost 也就是127.0.0.1 是一个回环地址（自己发请求自己相应）
    // host: 0.0.0.0  (可以被其他地方访问)
    // 端口号
    port: 7777,
    // 打开浏览器
    open: true,
    // 是否对静态文件开启GZip压缩
    compress: true,
    proxy: {
      // 例如：我们请求的路径是 /api/data  (实际上是 http://localhost:8080/api/data)
      '/api': {
        target: 'http://localhost:8888',
        // 代理后的地址是  http://localhost:8888/api/data  而真实的是http://localhost:8888/data
        // 因此需要重写路径 将/api替换为 ''
        pathRewrite: {
          '^/api': ''
        },
        // 是否需要改变源头 
        // 有些服务器会校验请求的header信息 如果不是预期的结果（例如当前的：localhost:8888 => localhost:7777） 则服务器是不会相应的（爬虫应用）
        changeOrigin:true
      }
    }
  },
  resolve: {
    // 配置扩展名 省略时 webpack从这里添加按顺序扩展名 知道找到位置
    extensions: ['.js', '.json', '.mjs', '.jsx', '.vue', '.ts'],
    // 配置别名
    alias: {
      '@':path.resolve(__dirname,'./src')
    }
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
      //type的类型
      //asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现；
      //asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现；
      //asset/source 导出资源的源代码。之前通过使用 raw-loader 实现；
      //asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体
      //积限制实现；
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
      },
      {
        test: /\.vue$/,
        use: [{
          loader:'vue-loader'
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
      BASE_URL: '"./"',
      // 是否支持vue2 options api  需要配置 不然控制台会有警告
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__:false
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
    }),
    // 打包vue文件所需要的plugin
    new VueLoaderPlugin()
  ]
}
