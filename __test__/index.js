const MysqlParse = require('../dist/index')
const db = new MysqlParse({
  host: '121.196.212.200',
  user: 'root',
  password: '@mysql572251465',
  database: 'super-admin-system'
})

db.on('open', async () => {
  const res = await db.find(['navName', 'id'], 'cuMenuNav')
  console.log(res)

  db.close()
})

db.on('error', (log) => {
  console.log(log)
})

db.on('mysql-log', (log) => {
  console.log(log)
})

db.open()
