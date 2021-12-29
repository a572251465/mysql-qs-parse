import MysqlParse from '../src'

describe('findOne 测试', () => {
  let db = null
  test('findOne 测试数据', async () => {
    db = new MysqlParse({
      host: 'localhost',
      user: 'root',
      password: 'location@root',
      database: 'super-admin-system'
    })

    await db.open()
    const res = await db.findOne(['type', 'visitNum'], 'cuVisitNum', {
      type: 'work-platform'
    })

    // 利用快照的形式 对数据进行模拟测试
    expect(res).toMatchSnapshot({
      type: 'work-platform',
      visitNum: expect.any(Number)
    })
  })

  afterAll(() => {
    db && db.release()
  })
})
