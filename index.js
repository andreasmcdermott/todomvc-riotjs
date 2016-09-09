const riot = require('riot')
const store = require('./src/store')
const todoList = require('./src/tags/todo-list')
riot.mount(todoList, { store: store })