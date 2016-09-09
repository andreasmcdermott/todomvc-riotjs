# todomvc-riotjs
TodoMVC-like app created with Riot.

[Live example](https://todomvc-riotjs-fihbzhhdvr.now.sh)

## About
This app was written to test/learn Riot. 
It was heavily inspired by [TodoMVC](http://todomvc.com) and implements the same features as those apps. 
It does not use the Riot compiler or Riot's tag-files. 
Instead it manually creates tags using Riot's API (inspired by [this blog post](http://blog.srackham.com/posts/riot-es6-webpack-apps/).

* Uses [Browserify](http://browserify.org/) for bundling files.
* Uses [Babel](https://babeljs.io/) to transpile from ES6 to ES5.
** Note: It does not use ES6 modules because Sheetify does not support it.
* Uses [Sheetify](https://github.com/stackcss/sheetify) to create scoped css.
* Includes a simple [Express](https://expressjs.com/) server for running locally.

## Install and run locally
`
1. Clone the repository
2. "npm install"
3. "npm run start"
4. Open "http://localhost:3000"
(5. "gulp watch" in new terminal tab)
(6. Make changes.)
(7. Refresh browser.)
(8. Repeat steps 6-8.)
`

## License
Everything in this repo is MIT License unless otherwise specified.