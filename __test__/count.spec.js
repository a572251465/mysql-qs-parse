import MysqlParse from '../src'
const connectionWay = {
  host: 'localhost',
  user: 'root',
  password: 'location@root',
  database: 'super-admin-system'
}

test('count 测试', async () => {
  const db = new MysqlParse(connectionWay)
  db.on('error', (info) => {
    console.log(info)
  })
  await db.open()

  const res = await db.size('cuIndexMenu', {
    type: 2
  })

  const res1 = await db.size('cuIndexMenu', {
    type: 999
  })

  db && db.release()
  expect(res).toBe(1)
  expect(res1).toBe(0)
})
