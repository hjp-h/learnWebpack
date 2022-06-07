// vue默认的版本是runtime的，不具备编译template的能力 需要切换版本 （写了.vue文件后,安装了vue-loader可以直接使用默认版本，它会利用@vue/compile-sfc(single file component)）
// import { createApp } from 'vue/dist/vue.esm-bundler'
import { createApp } from 'vue'
import App from '@/vue/App'
const { format } = require('./js/format')
import { add } from './js/math'
import './js/element'
console.log(add(1, 2))
console.log(format(2))

if (module.hot) {
  module.hot.accept('./js/format', () => {
    console.log('format模块热更新')
  })
}
// es6
const message = 'hello world'
const languages = ['js', 'php', 'java']
console.log(message)
languages.forEach(item => console.log(item))

// vue代码
// const app = createApp({
//   template: '<h2>我是vue渲染出来的</h2>',
//   data() {
//     return {
//       title:'vue'
//     }
//   }
// })
const app = createApp(App)
app.mount('#app')
