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
      type: `97cf679b-16df-4abc-ba81-d8076333ef3e`
    })
    console.log(res)
    db.release()
  })

  setTimeout(() => {
    makePromise().then(async (db) => {
      const res = await db.update({ visitNum: 200 }, 'cuVisitNum', {
        id: `97cf679b-16df-4abc-ba81-d8076333ef3e`
      })
      console.log(res)
      db.release()
    })
  }, 1000)

  setTimeout(() => {
    makePromise().then(async (db) => {
      const res = await db.insert({ 
        id: + new Date(),
        type: 'work-platform',
        visitNum: 200,
        active: 1
       }, 'cuVisitNum', {
        id: `97cf679b-16df-4abc-ba81-d8076333ef3e`
      })
      console.log(res)
      db.release()
    })
  }, 2000);
})()
