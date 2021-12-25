;(() => {
  const MysqlParse = require('../dist/index')
  const connection = new MysqlParse({
    host: '121.196.212.200',
    user: 'root',
    password: '@mysql572251465',
    database: 'super-admin-system'
  })
  connection.on('error', (log) => {
    console.log(log)
  })

  connection.on('mysql-log', (log) => {
    console.log(log)
  })

  const makePromise = () => {
    return new Promise((resolve) => {
      connection.once('open', async () => {
        resolve(connection)
      })

      connection.open()
    })
  }

  makePromise().then(async (db) => {
    const res = await db.find(['value'], 'cuEnumTypes', {
      type: 'visit'
    })
    console.log(res)
  })
})()
