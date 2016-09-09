const riot = require('riot')
const sf = require('sheetify')
const todoItem = require('./todo-item.js')

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

  :host > [type=checkbox] {
    position: absolute;
    top: -3em;
  }

  ul {
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

  .remainingCount {
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
  <form onsubmit="{onAddItem}">
    <input id="newTodoTitle" type="text" placeholder="What needs to be done?" autofocus />
  </form>
</header>
<section if="{items.length}" class="${sectionCss}">
  <input type="checkbox" __checked="{areAllCompleted()}" onclick="{onToggleAllCompleted}" />
  <ul>
    <li each="{item in filteredItems()}">
      <todo-item item="{item}" dispatcher="{parent.dispatcher}"></todo-item>
    </li>
  </ul>
</section>
<footer if="{items.length}" class="${footerCss}">
  <span class="remainingCount">{countUncompleted()} item{countUncompleted() !== 1 ? 's' : ''} left</span>
  <a href="#" onclick="{onClearCompleted}" class="clearCompleted">Clear completed</a>
  <div class="filters">
    <a each="{key, filter in filters}" href="/#/{key}" class="filter {active: activeFilter === key}">{filter.title}</a>
  </div>
</footer>
`, 
function (opts) {
  riot.route(filter => {
    this.activeFilter = this.filters.hasOwnProperty(filter) ? filter : 'all'
    this.update()
  })
  riot.route.start(true)

  this.dispatcher = riot.observable()
  this.dispatcher.on('todo-item:updated', _ => {
    opts.store.save(this.items)
  })

  this.items = opts.store.fetch()
  this.filters = {
    all: { func: items => items, title: 'All' },
    active: { func: items => items.filter(item => !item.completed), title: 'Active' },
    completed: { func: items => items.filter(item => item.completed), title: 'Completed' }
  }
  this.activeFilter = null

  this.filteredItems = _ => this.filters[this.activeFilter].func(this.items)

  this.areAllCompleted = _ => this.items.every(item => item.completed)
  this.countUncompleted = _ => this.items.filter(item => !item.completed).length

  this.onToggleAllCompleted = e => {
    this.items.forEach(item => {
      item.completed = e.target.checked
    })
  }

  this.onClearCompleted = e => {
    e.preventDefault()
    this.items = this.filters.active.func(this.items)
  }

  this.onAddItem = e => {
    e.preventDefault()
    let title = this.newTodoTitle.value.trim()
    if (title) {
      this.items.push({
        title,
        completed: false
      })
      opts.store.save(this.items)
      e.target.reset()
    }
  }
})