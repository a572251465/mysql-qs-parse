import MysqlParse from '../src'
const connectionWay = {
  host: 'localhost',
  user: 'root',
  password: 'location@root',
  database: 'super-admin-system'
}

test('测试 query', async () => {
  const db = new MysqlParse(connectionWay)
  await db.open()

  const res = await db.query(`
    SELECT
      b.id,
      b.NAME 
    FROM
      cutodousers a,
      cuprojectitem b,
      cuprojectlimit c 
    WHERE
      a.username = '2495041749@qq.com' and
      a.active = 1 and
      a.id = c.userId AND
      b.active = 1 and
      c.projectId = b.id and
      c.active = 1
  `)
  expect(res.length).toBe(2)

  db.release()
})
