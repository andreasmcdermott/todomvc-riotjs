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
  <input type="checkbox" __checked="{item.completed}" onclick="{onToggleComplete}" />
  <label hide="{editing}" ondblclick="{onStartEdit}" class="{completed: item.completed}">{item.title}</label>
  <input show="{editing}" name="editInput" type="text" value="{item.title}" onkeyup="{onEditKeyup}" />
</div>
`, 
function (opts) {
  this.item = opts.item
  this.editing = false

  this.onToggleComplete = e => {
    this.item.completed = e.target.checked
    opts.dispatcher.trigger('todo-item:updated', this.item)
  }

  this.onStartEdit = e => {
    e.preventDefault()
    this.editing = true
    this.originalTitle = this.item.title
    this.editInput.focus();
  }

  const KEY_ESC = 27
  const KEY_RETURN = 13 

  this.onEditKeyup = e => {
    if (e.which === KEY_ESC) {
      this.item.title = this.originalTitle
      this.editing = false
    } else if (e.which === KEY_RETURN) {
      this.item.title = e.target.value.trim()
      this.editing = false
      opts.dispatcher.trigger('todo-item:updated')
    }
  }
})