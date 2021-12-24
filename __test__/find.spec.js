;(() => {
  const MysqlParse = require('../dist/index')
  const connection = new MysqlParse({
    host: 'localhost',
    user: 'root',
    password: 'location@root',
    database: 'super-admin-system'
  })

  const makePromise = () => {
    return new Promise((resolve) => {
      connection.on('open', async () => {
        resolve(connection)
      })

      connection.on('error', (log) => {
        console.log(log)
      })

      connection.on('mysql-log', (log) => {
        console.log(log)
      })

      connection.open()
    })
  }

  makePromise().then(async (db) => {
    const res = await db.findOne(['id', 'name'], 'cuIndexMenu')
    console.log(res)
  })
  setTimeout(() => {
    makePromise().then(async (db) => {
      const res = await db.findOne(['id', 'name'], 'cuIndexMenu')
      console.log(res)
    })
  }, 1000)
})()
