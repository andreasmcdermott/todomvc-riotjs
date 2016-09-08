const riot = require('riot')
const sf = require('sheetify')

const css = sf`
  [type=checkbox] {
    position: absolute;
    left: 0;
  }

  [type=text] {
    width: calc(100% - 4em);
    border: none;
    display: inline-block;
    margin-left: 2em;
    font-size: 1em;
    padding: 0;
  }

  label {
    width: calc(100% - 2em);
    margin-left: 2em;
    display: inline-block;
  }

  label.completed {
    text-decoration: line-through;
  }
`

module.exports = riot.tag('todo-item', 
`
<div class="${css}">
  <input type="checkbox" checked="{item.completed}" onclick="{complete}" />
  <label hide="{editing}" ondblclick="{edit}" class="{completed: item.completed}">{item.title}</label>
  <input show="{editing}" name="editInput" type="text" value="{item.title}" onkeyup="{onEdit}" />
</div>
`, 
function (opts) {
  this.dispatcher = opts.dispatcher
  this.item = opts.item
  this.editing = false

  this.complete = e => {
    this.item.completed = e.target.checked
    this.dispatcher.trigger('todo:updated', this.item)
  }

  this.edit = e => {
    e.preventDefault()
    this.editing = true
    this.originalTitle = this.item.title
    this.editInput.focus();
  }

  this.onEdit = e => {
    if (e.which === 27) {
      this.item.title = this.originalTitle
      this.editing = false
    } else if (e.which === 13) {
      this.item.title = e.target.value.trim()
      this.editing = false
      this.dispatcher.trigger('todo:updated')
    }
  }
})