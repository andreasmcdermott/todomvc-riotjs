const riot = require('riot')
const todoItem = require('./todo-item.js')
const sf = require('sheetify')
const store = require('../store.js')

const headerCss = sf`
  :host {
    padding: 0 0.5em;
  }

  [type=text] {
    width: calc(100% - 2em);
    margin-left: 2em;
    padding: 1em 0;
    border: none;
    font-size: 1em;
  }
`

const sectionCss = sf`
  :host {
    padding: 0 0.5em;
    position: relative;
    background-color: white;
  }
`

const completeAllCss = sf`
  :host {
    position: absolute;
    top: -3em;
  }
`

const listCss = sf`
  :host {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    position: relative;
    padding: 0.5em 0;
  }
`

const footerCss = sf`
  :host {
    font-size: 0.8em;
    padding: 0.5em;
  }

  .filters {
    width: 40%;
    margin: 0 auto;
  }

  .filter {
    display: inline-block;
    padding: 0.2em;
  }

  .count {
    padding: 0.2em;
    float: left;
  }

  .clearCompleted {
    padding: 0.2em;
    float: right;
  }
`

module.exports = riot.tag('todo-list', 
`
<header class="${headerCss}">
  <form onsubmit="{add}">
    <input id="newTodo" type="text" placeholder="What needs to be done?" autofocus />
  </form>
</header>
<section if="{items.length}" class="${sectionCss}">
  <input type="checkbox" __checked="{allCompleted()}" onclick="{completeAll}" class="${completeAllCss}" />
  <ul class="${listCss}">
    <li each="{item in filteredItems()}">
      <todo-item item="{item}" dispatcher="{parent.dispatcher}"></todo-item>
    </li>
  </ul>
</section>
<footer if="{items.length}" class="${footerCss}">
  <span class="count">{countUncompleted()} item{countUncompleted() !== 1 ? 's' : ''} left</span>
  <a href="#" onclick="{clearCompleted}" class="clearCompleted">Clear completed</a>
  <div class="filters">
    <a each="{key, filter in filters}" href="/#/{key}" class="filter {active: activeFilter == key}">{filter.title}</a>
  </div>
</footer>
`, 
function (opts) {
  riot.route(filter => {
    this.activeFilter = filter || 'all'
    this.update()
  })
  
  riot.route.start(true)

  this.dispatcher = riot.observable()
  this.dispatcher.on('todo:updated', _ => {
    store.save(this.items)
  })

  this.items = store.fetch()
  this.filters = {
    all: { func: items => items, title: 'All' },
    active: { func: items => items.filter(item => !item.completed), title: 'Active' },
    completed: { func: items => items.filter(item => item.completed), title: 'Completed' }
  }
  this.activeFilter = null;

  this.setFilter = filter => { this.activeFilter = filter }
  this.filteredItems = _ => this.filters[this.activeFilter].func(this.items)

  this.allCompleted = _ => this.items.every(item => item.completed)
  this.countUncompleted = _ => this.items.filter(item => !item.completed).length

  this.completeAll = e => {
    this.items.forEach(item => {
      item.completed = e.target.checked
    })
  }

  this.clearCompleted = e => {
    e.preventDefault()
    this.items = this.filters.active.func(this.items)
  }

  this.add = e => {
    e.preventDefault()
    if (this.newTodo.value) {
      this.items.push({
        title: this.newTodo.value.trim(),
        completed: false
      })
      store.save(this.items)
      e.target.reset()
    }
  }
})