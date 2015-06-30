'use strict'

var pg = require('pg')
var fastfall = require('fastfall')

function withConn (connString, func) {
  var fall = fastfall()

  return function callFunc () {
    var holder = new Holder()
    holder.callback = arguments[arguments.length - 1]
    holder.caller = this

    for (var i = 0; i < arguments.length - 1; i++) {
      holder.args[i] = arguments[i]
    }

    if (Array.isArray(func)) {
      holder.func = fastfall(func)
    } else {
      holder.func = func
    }

    fall(holder, [
      getConn,
      execute
    ], release)
  }

  // TODO reuse in a linked list
  function Holder () {
    this.args = []
    this.func = null
    this.conn = null
    this.caller = null
  }

  function getConn (next) {
    pg.connect(connString, next)
  }

  function execute (conn, done, next) {
    this.done = done
    this.args.push(next)
    this.args.unshift(conn)
    this.func.apply(this.caller, this.args)
  }

  function release () {
    this.done()
    this.callback.apply(null, arguments)
  }
}

module.exports = withConn
module.exports.end = pg.end.bind(pg)
