import { PoolConnection } from 'mysql'
import { IConnectConfigOptions, IField, INumeralTypes, IRecords, IResultRecords, IValueChange } from './types'

import * as mysql from 'mysql'
import * as qs from 'querystringify'
import EventEmitter from './EventEmitter'
import { sqlSplicing, checkFieldsType, isNullCheck, commonSplicing, sqlWhereSplicing, replaceValues } from './utils'
const { isArray } = require('where-type')

// 默认选项
let defaultsOptions: IField<IValueChange<mysql.PoolConfig>> = {
  connectionLimit: 100,
  waitForConnections: true,
  queueLimit: 0,
  debug: true,
  wait_timeout: 28800,
  connect_timeout: 10
}

class MysqlParse extends EventEmitter {
  public db: PoolConnection | null = null
  constructor(host: string, user: string, password: string, database: string)
  constructor(host: IConnectConfigOptions, user?: string, password?: string, database?: string)
  // 主机名/ 用户/ 密码/ 数据库
  constructor(
    public host: string | IConnectConfigOptions,
    public user: string,
    public password: string,
    public database: string
  ) {
    super()
    if (typeof this.host === 'object') {
      defaultsOptions = this.host
      const { host, user, password, database } = this.host
      this.host = host
      this.user = user
      this.password = password
      this.database = database
    }
  }

  /**
   * @author lihh
   * @description 打开mysql连接
   */
  open() {
    const { host, user, password, database } = this
    const pool = mysql.createPool({ ...defaultsOptions, host: host as string, user, password, database })
    pool.getConnection((err, connection) => {
      if (err) {
        this.emit('error', err)
      } else {
        this.db = connection
        this.emit('open')
      }
    })
  }

  /**
   * @author lihh
   * @description 进行数据库连接关闭
   */
  close() {
    if (this.db) {
      this.db.end()
      this.emit('close')
      this.db = null
    }
  }

  /**
   * @author lihh
   * @description 给用户提供自动释放连接
   */
  release() {
    this.db && this.db.release()
  }

  /**
   * @author lihh
   * @description 内部用来订阅log用
   * @param record 以及操作表记录
   */
  private logRecords(record: string) {
    this.emit('mysql-log', {
      record
    })
  }

  /**
   * @author lihh
   * @description 共同查询 无论是单条数据 还是多条数据
   * @param fields 查询的字段
   * @param tableName 需要的表名
   * @param where 以及查询的条件
   */
  private comQuery(fields: IField[], tableName: string, where: IRecords): Promise<{ sql: string; data: IRecords[] }> {
    return new Promise((resolve, reject) => {
      let sql = `select ${sqlSplicing(fields)} from ${tableName}`
      if (where && typeof where === 'object' && Object.keys(where).length > 0) {
        sql += ` where ${qs.stringify(where)}`
      }

      // 进行数据查询
      this.db?.query(sql, (err, results: IResultRecords[]) => {
        if (err) {
          this.emit('error', err, sql)
          return reject(err)
        }

        const result = isArray(results) && results.length > 0 ? results : []
        resolve({
          sql,
          data: result
        })
      })
    })
  }

  /**
   * @author lihh
   * @description 进行单个数据查询
   * @param fields 查询的字段
   * @param tableName 需要的表名
   * @param where 以及查询的条件
   */
  async findOne(fields: IField[], tableName: string, where: IRecords): Promise<any> {
    const { sql, data } = await this.comQuery(fields, tableName, where)
    this.logRecords(sql)

    return data.length > 0 ? data[0] : data
  }

  /**
   * @author lihh
   * @description 用来查询多条数据
   * @param fields 查询的字段
   * @param tableName 需要的表名
   * @param where 以及查询的条件
   */
  async find(fields: IField[], tableName: string, where: IRecords): Promise<any> {
    const { sql, data } = await this.comQuery(fields, tableName, where)
    this.logRecords(sql)
    return data
  }

  /**
   * @author lihh
   * @description 表示对数据进行插入
   * @param fields 表示插入的字段
   * @param tableName 表示表名
   */
  insert(fields: IRecords, tableName: string) {
    try {
      isNullCheck(fields, `${tableName} update`, INumeralTypes.ONE)
      isNullCheck(tableName, `${tableName} update`, INumeralTypes.TWO)

      checkFieldsType(fields, ['object'], tableName)
    } catch (e) {
      this.emit('error', e)
      throw e
    }

    // 执行sql
    const values = Array.from({ length: Object.keys(fields).length }, () => '?').join(',')
    const sql = `insert into ${tableName} (${Object.keys(fields).join(',')}) values (${values})`
    return new Promise((resolve, reject) => {
      this.db?.query(sql, Object.values(fields), (err) => {
        if (err) {
          this.emit('error', err)
          return reject({
            sql,
            data: err
          })
        }

        resolve({
          sql,
          data: 1
        })
      })
    })
  }

  /**
   * @author lihh
   * @description 表示对表数据进行更新
   * @param fields 表示更新的字段
   * @param tableName 表示更新的表
   * @param where 表示更新的条件
   */
  update(fields: IRecords, tableName: string, where: IRecords) {
    try {
      // 确定值check
      isNullCheck(fields, `${tableName} update`, INumeralTypes.ONE)
      isNullCheck(tableName, `${tableName} update`, INumeralTypes.TWO)

      checkFieldsType(fields, ['object'], tableName)
      checkFieldsType(where, ['object'], tableName)
    } catch (e) {
      this.emit('error', e)
      throw e
    }

    // 更新参数
    const modSqlParams = Object.values(fields).concat(Object.values(where))
    // 执行sql文
    const sql = `update ${tableName} set ${commonSplicing(replaceValues(fields, '?'))} ${sqlWhereSplicing(
      replaceValues(where, '?')
    )}`
    return new Promise((resolve, reject) => {
      this.db?.query(sql, modSqlParams, (err, results: number) => {
        if (err) {
          this.emit('error', err, sql)
          return reject({ sql, data: err })
        }

        resolve({
          sql,
          data: results
        })
      })
    })
  }

  /**
   * @author lihh
   * @description 表示对数据进行删除 如果传递了删除字段就是逻辑删除 反之就是物理删除
   * @param tableName 表示删除的表
   * @param where 删除的条件
   * @param fields 逻辑删除更新的字段
   */
  delete(tableName: string, where: IRecords, fields?: IRecords) {
    try {
      // 确定值check
      isNullCheck(tableName, `${tableName} update`, INumeralTypes.ONE)
      isNullCheck(where, `${tableName} update`, INumeralTypes.TWO)

      checkFieldsType(where, ['object'], tableName)
      if (fields) {
        checkFieldsType(fields, ['object'], tableName)
      }
    } catch (e) {
      this.emit('error', e)
      throw e
    }

    // 判断是否是逻辑删除
    if (!fields) {
      return this.update(fields!, tableName, where)
    }

    // 进行表的删除
    const sql = `delete from ${tableName} ${sqlWhereSplicing(where)}`
    return new Promise((resolve, reject) => {
      this.db?.query(sql, (err, results: number) => {
        if (err) {
          this.emit('error', err, sql)
          return reject({ sql, data: err })
        }

        resolve({
          sql,
          data: results
        })
      })
    })
  }
}

export default MysqlParse
