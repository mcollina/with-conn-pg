# with-conn-pg&nbsp;&nbsp;[![Build Status](https://travis-ci.org/mcollina/with-conn-pg.svg)](https://travis-ci.org/mcollina/with-conn-pg)


Calls a function injecting a pg connection, and release it afterwards

## Install

```
npm install with-conn-pg --save
```

<a name="api"></a>
## API

  * <a href="#factory"><code><b>withConnPg()</b></code></a>
  * <a href="#withConn"><code><b>withConn()</b></code></a>
  * <a href="#end"><code>withConn.<b>end()</b></code></a>

-------------------------------------------------------

<a name="factory"></a>
### withConnPg(config)

Returns a new instance of [`withConn`](#withConn).
Config can be both an object or a string. In case of an object, check
[`pg`](https://www.npmjs.com/package/pg). The connection string is
parsed with:
[`pg-connection-string`](https://www.npmjs.com/package/pg-connection-string).

-------------------------------------------------------

<a name="withConn"></a>
### withConn(func(conn, args.., done))

Wraps the passed function so that the first argument is what is
returned by
[`pool.connect()`](https://www.npmjs.com/package/pg) and release it afterwards.

`this` is preserved, and any arguments will be passed through.

If multiple functions are passed, they will be wrapped in a
[fastfall](http://npm.im/fastfall).

Example:

```js
var connString = 'postgres://localhost/with_conn'
var withConn = require('with-conn-pg')(connString)
var func = withConn(function (client, arg, done) {
  console.log('input is', arg)
  client.query('SELECT $1::int AS number', [arg], function (err, result) {
    done(err, result.rows[0])
  })
})

func(42, function (err, result) {
  console.log('output is', result.number)
})
```

-------------------------------------------------------

<a name="end"></a>
### withConn.end()

Wraps [`pool.end()`](https://www.npmjs.com/package/pg) to release the
connection pool (useful during testing).

## License

MIT
