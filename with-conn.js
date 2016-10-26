'use strict'

var pg = require('pg')
var fastfall = require('fastfall')
var parseConnString = require('pg-connection-string').parse

function factory (config) {
  if (typeof config === 'string') {
    config = parseConnString(config)
  }

  var pool = new pg.Pool(config)

  withConn.end = pool.end.bind(pool)

  return withConn

  function withConn (func) {
    var fall = fastfall()

    return function callFunc () {
      var holder = new Holder()
      holder.callback = arguments[arguments.length - 1]
      holder.caller = this
      holder.args = new Array(arguments.length - 1)

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

    function Holder () {
      this.args = null
      this.func = null
      this.conn = null
      this.caller = null
    }

    function getConn (next) {
      pool.connect(next)
    }

    function execute (conn, done, next) {
      this.done = done
      this.args.push(next)
      this.args.unshift(conn)
      this.func.apply(this.caller, this.args)
    }

    function release () {
      if (this.done) {
        this.done()
      }
      this.callback.apply(null, arguments)
    }
  }
}

module.exports = factory
