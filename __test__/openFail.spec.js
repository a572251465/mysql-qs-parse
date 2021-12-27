import MysqlParse from '../src'

describe('连接数据库失败', () => {
  // 进行执行断言  最好需要执行一次
  expect.assertions(1)
  test('测试 open', async () => {
    const mysqlParse = new MysqlParse({
      host: 'localhost',
      user: 'root',
      password: 'location@root',
      database: 'super-admin-system1'
    })

    try {
      await mysqlParse.open()
    } catch (e) {
      expect(e).not.toBeNull()
    }
  })
})
