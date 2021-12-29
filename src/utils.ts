import { ICheckOptions, IField, IFieldOptions, ILimitOptions } from './types'
const { isArray, getTypes, isNumber, isObject } = require('where-type')

/**
 * @author lihh
 * @description 进行sql查询字段的拼接
 * @param fields 表示需要查询的字段 允许别名
 */
const sqlSplicing = (fields: IFieldOptions[]): string => {
  const arr = fields.map((item) => {
    if (typeof item === 'string') return item

    const values = Object.keys(item).map((cur) => `${cur} as ${item[cur]}`)
    return values.join(',')
  })
  return arr.join(', ')
}

/**
 * @author lihh
 * @description 进行参数类型判断
 * @param value 表示传递的值
 */
const paramsTypes = (value: string | IField) => {
  if (value === '?') return value
  return isNumber(value) ? +value : `'${value}'`
}

/**
 * @author lihh
 * @description 表示共同的拼接 一般都是key = value
 * @param fields 拼接的字段
 */
const commonSplicing = (fields: IField): string | string[] => {
  // 首先判断是否为空
  if (!fields || Object.keys(fields).length === 0) return ''

  return Object.keys(fields).map((cur) => `${cur} = ${paramsTypes(fields[cur])}`)
}

/**
 * @author lihh
 * @description 对排序的字段进行字符串拼接操作
 * @param order 排序的对象
 */
const orderSplicing = (order: IField): string => {
  if (!isObject(order)) return ''

  // 进行正确内容筛选 排序的值只能是bottom，top
  const transformValues: IField = {
    bottom: 'desc',
    top: 'asc'
  }
  const afterOrder = Object.keys(order).reduce((pre, cur) => {
    const item = order[cur] as string
    if (!['bottom', 'top'].includes(item)) return pre
    pre.push(`${cur} ${transformValues[item]}`)
    return pre
  }, [] as string[])
  return afterOrder.length === 0 ? '' : ` ORDER BY ${afterOrder.join(', ')}`
}

/**
 * @author lihh
 * @description 进行sql where 条件的拼接
 * @param fields where的条件的拼接
 */
const sqlWhereSplicing = (fields: IField): string => {
  const values = commonSplicing(fields)
  if (values === '') return ''

  const sql = (values as string[]).join(' and ')
  return ` where ${sql}`
}

/**
 * @author lihh
 * @description 进行类型检查
 * @param content 检查的内容
 * @param expectTypes 以及期望出现的类型
 * @param tableName 查询表名称
 */
const checkFieldsType = (
  content: IField | ICheckOptions[] | ILimitOptions,
  expectTypes: string[],
  tableName: string
) => {
  // 进行数据格式化 统一使用数组来处理
  if (!isArray(content)) {
    if (Object.keys(content).length === 0) return
    content = [content as IField]
  }

  for (const item of content as ICheckOptions[]) {
    const type = getTypes(item)
    if (!expectTypes.includes(type)) {
      throw new TypeError(
        ` For table <${tableName}>, the field type should be ${expectTypes.join(' | ')}, but type ${type} appears `
      )
    } else {
      if (type !== 'object') continue

      // 对象的值不能是null || undefined
      const values = Object.values(item)
      values.forEach((objValue, key) => {
        if (objValue === null || objValue === undefined) {
          throw new Error(`For table ${tableName}, the value of property a cannot be null`)
        }
      })
    }
  }
}

/**
 * @author lihh
 * @description 进行类型判断 判断是否为空
 * @param content 判断的内容
 * @param message 判断出错后的消息
 * @param num 表示参数的位置
 */
function isNullCheck(content: null | undefined | string | IField | any[], message: string, num: string) {
  // 判断类型是否为null | undefined
  if (content === null || content === undefined) {
    throw new TypeError(`In ${message}, the ${num} Parameter cannot be empty `)
  }
  if (isArray(content) && content.length === 0) {
    throw new TypeError(`In ${message}, the ${num} Parameter cannot be empty `)
  }
}

/**
 * @author lihh
 * @description 进行对象的值调换
 * @param fields 需要替换的对象
 * @param sign 更新后的值
 */
function replaceValues(fields: IField, sign: string) {
  return Object.keys(fields).reduce((pre, cur) => {
    pre[cur] = sign
    return pre
  }, {} as IField)
}

export { sqlSplicing, checkFieldsType, isNullCheck, orderSplicing, sqlWhereSplicing, commonSplicing, replaceValues }
