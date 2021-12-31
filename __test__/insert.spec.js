import MysqlParse from '../src'
const connectionWay = {
  host: 'localhost',
  user: 'root',
  password: 'location@root',
  database: 'super-admin-system'
}

test('insert 测试', async () => {
  const db = new MysqlParse(connectionWay)
  db.on('error', (log) => {
    console.log(log)
  })
  await db.open()

  const res = await db.insert(
    {
      id: +new Date(),
      username: '2495041749@qq.com',
      password:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMTIzNDU2IiwiaWF0IjoxNjQwOTM5MDY0fQ.euoWgJcJ-n6B8uIcaguEdqMJyUMiRYbVr8o7UDSCiZs',
      active: 1,
      createTime: '2021-12-31 17:25:25'
    },
    'cuTodoUsers'
  )
  db.release()

  expect(res).toBe(1)
})
