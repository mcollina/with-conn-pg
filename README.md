# with-conn-pg

Calls a function injecting a pg connection, and release it afterwards

## Install

```
npm install with-conn-pg
```

<a name="api"></a>
## API

  * <a href="#withConn"><code><b>withConnPg()</b></code></a>
  * <a href="#end"><code>withConnPg.<b>end()</b></code></a>

-------------------------------------------------------

<a name="withConn"></a>
### withConnPg(connectionString, func(conn, args.., done) or [func1, func2])

Wraps the passed function so that the first argument is what is
returned by
[`pg.connect()`](https://www.npmjs.com/package/pg) and release it afterwards.

`this` is preserved, and any arguments will be passed through.

If multiple functions are passed, they will be wrapped in a
[fastfall](http://npm.im/fastfall).

Example:

```js
var withConn = require('with-conn-pg')
var connString = 'postgres://localhost/with_conn'
var func = withConn(connString, function (client, arg, done) {
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
### withConnPg.end()

Wraps [`pg.end()`](https://www.npmjs.com/package/pg) to release the
connection pool (useful during testing).

## License

MIT
