import MysqlParse from '../src'
const connectionWay = {
  host: 'localhost',
  user: 'root',
  password: 'location@root',
  database: 'super-admin-system'
}

describe('findOne 测试', () => {
  test('findOne 测试数据', async () => {
    let db = new MysqlParse(connectionWay)

    await db.open()
    const res = await db.findOne(['type', 'visitNum'], 'cuVisitNum', {
      type: 'work-platform'
    })

    // 利用快照的形式 对数据进行模拟测试
    expect(res).toMatchSnapshot({
      type: 'work-platform',
      visitNum: expect.any(Number)
    })

    db && db.release()
  })

  test('findOne not-fount', async () => {
    const db = new MysqlParse(connectionWay)

    db.on('error', (info) => {
      console.log(info)
    })

    await db.open()
    const data = await db.findOne(['type'], 'cuVisitNum', { type: '1111' })
    expect(data).toBeNull()

    db && db.release()
  })
})
