import MysqlParse from '../src'
const connectionWay = {
  host: 'localhost',
  user: 'root',
  password: 'location@root',
  database: 'super-admin-system'
}

test('测试 update', async () => {
  const db = new MysqlParse(connectionWay)
  await db.open()

  const res = await db.update({taskContent: '测试任务'}, 'cuTodoTask', {id: '22e02591-ea73-4914-af95-32abbf5eae85'})
  const res1 = await db.update({taskContent: '测试任务11'}, 'cuTodoTask', {id: 'ce852d59-41c9-4516-a8ba-ac38a9b44811'})

  db.release()
  expect(res === 0).toBeFalsy()
  expect(res1).toBe(0)
})
