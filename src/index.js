const { format } = require('./js/format')
import { add } from './js/math'
import './js/element'
console.log(add(1, 2))
console.log(format(2))

// es6
const message = 'hello world'
const languages = ['js', 'php', 'java']
console.log(message)
languages.forEach(item => console.log(item))
