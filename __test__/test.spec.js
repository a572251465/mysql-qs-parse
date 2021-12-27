import sum from '../src/test'

describe('测试ts案例', () => {
  test('测试sum：', () => {
    expect(sum(1, 2)).toBe(3)
  })
})
