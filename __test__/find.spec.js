import MysqlParse from '../src'
const connectionWay = {
  host: 'localhost',
  user: 'root',
  password: 'location@root',
  database: 'super-admin-system'
}

describe('测试查询函数find方法', () => {
  test('find 无条件查询多条数据', async () => {
    const db = new MysqlParse(connectionWay)
    db.on('error', (info) => {
      console.log(info)
    })
    await db.open()

    const res = await db.find(['name', 'introduce'], 'cuIndexMenu')

    db && db.release()

    expect(Array.isArray(res)).toBeTruthy()
    expect(res.length > 0).toBeTruthy()
    expect(res[0]).toMatchSnapshot({
      name: expect.any(String),
      introduce: expect.any(String)
    })
  })

  test('find 按照条件进行查询', async () => {
    const db = new MysqlParse(connectionWay)
    await db.open()

    const res = await db.find({
      fields: ['name', 'introduce', 'details'],
      tableName: 'cuIndexMenu',
      where: {
        type: 1
      }
    })
    db && db.release()

    expect(Array.isArray(res)).toBeTruthy()
    expect(res.length > 0).toBe(true)
    expect(res.length).toBe(2)
  })

  test('find 测试查询不到数据', async () => {
    const db = new MysqlParse(connectionWay)
    await db.open()

    const res = await db.find(['name'], 'cuIndexMenu', {
      type: 100
    })

    db && db.release()

    expect(res.length).toBe(0)
  })

  test('find limit 测试', async () => {
    const db = new MysqlParse(connectionWay)
    await db.open()

    const res = await db.find({
      fields: ['name'],
      tableName: 'cuIndexMenu',
      limit: {
        page: 1,
        limit: 2
      }
    })

    db && db.release()

    expect(res.length).toBe(2)
  })

  test('find order 排序测试', async () => {
    const db = new MysqlParse(connectionWay)
    db.on('error', (info) => {
      console.log(info)
    })
    await db.open()

    const res = await db.find({
      fields: ['type'],
      tableName: 'cuIndexMenu',
      order: {
        type: 'top'
      }
    })

    db && db.release()

    expect(+res[0]['type'] === 1 && +res[2]['type'] === 2 && +res[res.length - 1]['type'] === 6).toBeTruthy()
  })
})
