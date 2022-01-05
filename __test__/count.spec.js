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

  const res2 = await db.size('cuTodoTask',{ taskContent: '今天的任务就是接口测试通过', projectId: 'b26b96bc-7d07-43ea-af0d-5545103fa119', active: 1 })

  db && db.release()
  expect(res).toBe(1)
  expect(res1).toBe(0)
  expect(res2).toBe(0)
})
