const KEY = 'todomvc-amcd';

module.exports = {
  fetch: _ => JSON.parse(localStorage.getItem(KEY) || '[]'),
  save: items => { localStorage.setItem(KEY, JSON.stringify(items)) }
}