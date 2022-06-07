import '../css/element.css'
import zznh from '../img/zznh.png'
import '../font/iconfont.css'
// import '../css/test.less'
// 1.内联loader
// import 'css-loader!../css/element.css'
const divEl = document.createElement('div')
divEl.className = 'title'
divEl.innerText = 'Hello Webpack'

// 使用图片
// (1) 使用bgUrl的方式
const bgDivEl = document.createElement('div')
bgDivEl.className = 'bg-img'

// （2）img src的方式
const imgEl = document.createElement('img')
imgEl.src = zznh
imgEl.width = '200'
imgEl.height = '200'

// 使用字体图标
const iEl = document.createElement('i')
iEl.className = 'iconfont icon-ashbin'

document.body.append(divEl)
document.body.append(bgDivEl)
document.body.append(imgEl)
document.body.append(iEl)


