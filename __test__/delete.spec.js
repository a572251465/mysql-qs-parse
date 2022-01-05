import MysqlParse from '../src'
const connectionWay = {
  host: 'localhost',
  user: 'root',
  password: 'location@root',
  database: 'super-admin-system'
}

test('测试 delete', async () => {
  const db = new MysqlParse(connectionWay)
  await db.open()

  const res = await db.delete('cuTodoTask', {id: '22e02591-ea73-4914-af95-32abbf5eae85', active: 1}, {active: 0})
  const res1 = await db.delete('cuTodoTask', {id: '22e02591-ea73-4914-af95-32abbf5eae85', active: 1}, {active: 0})
  db.release()

  expect(res > 0).toBeTruthy()
  expect(res1).toBe(0)
})