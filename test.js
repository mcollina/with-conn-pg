'use strict'

var test = require('tape')
var withConn = require('./')

var connString = 'postgres://localhost/with_conn'

test('gets a connection', function (t) {
  var func = withConn(connString, function (client, done) {
    client.query('SELECT $1::int AS number', ['1'], function (err, result) {
      t.error(err, 'no error')
      t.equal(result.rows[0].number, 1, 'output matches')
      done()
      // clears the pg pool
      withConn.end()
    })
  })

  func(t.end.bind(t))
})

test('accepts a parameter', function (t) {
  var func = withConn(connString, function (client, arg, done) {
    t.equal(arg, 42, 'parameter matches')
    client.query('SELECT $1::int AS number', ['1'], function (err, result) {
      t.error(err, 'no error')
      t.equal(result.rows[0].number, 1, 'output matches')
      done()
      // clears the pg pool
      withConn.end()
    })
  })

  func(42, t.end.bind(t))
})

test('builds a waterfall', function (t) {
  var func = withConn(connString, [
    function (client, arg, done) {
      t.equal(arg, 42, 'parameter matches')
      client.query('SELECT $1::int AS number', ['1'], function (err, result) {
        t.error(err, 'no error')
        t.equal(result.rows[0].number, 1, 'output matches')
        done(null, 24)
      })
    },
    function (something, more) {
      t.equal(something, 24, 'result matches')
      more(null, something)
    }])

  func(42, function (err, result) {
    t.error(err, 'no error')
    t.equal(result, 24, 'result matches')

    // clears the pg pool
    withConn.end()
    t.end()
  })
})
