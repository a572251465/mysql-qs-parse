import {
  IConnectConfigOptions,
  IField,
  IFieldOptions,
  IFindOptions,
  ILimitOptions,
  INumeralTypes,
  IRecords,
  IResultRecords,
  IValueChange
} from './types'

import * as mysql from 'mysql'
import EventEmitter from './EventEmitter'
import {
  sqlSplicing,
  checkFieldsType,
  isNullCheck,
  commonSplicing,
  sqlWhereSplicing,
  replaceValues,
  orderSplicing
} from './utils'
const { isArray, isObject } = require('where-type')

// 默认选项
let defaultsOptions: IField<IValueChange<mysql.ConnectionConfig>> = {
  connectionLimit: 1000,
  waitForConnections: true,
  queueLimit: 0,
  debug: true,
  wait_timeout: 28800,
  connect_timeout: 10
}

class MysqlParse extends EventEmitter {
  public db: mysql.Connection | null = null
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
    return new Promise((resolve, reject) => {
      const { host, user, password, database } = this
      const connection = mysql.createConnection({ ...defaultsOptions, host: host as string, user, password, database })
      connection.connect((err) => {
        if (err) {
          this.emit('error', err)
          reject(err)
        } else {
          this.db = connection
          this.emit('open')
          resolve(connection)
        }
      })
    })
  }

  /**
   * @author lihh
   * @description 给用户提供自动释放连接
   */
  release() {
    if (this.db) {
      this.db.end((err) => {
        if (err) {
          this.emit('error', err)
          return
        }

        this.emit('close')
        this.db = null
      })
    }
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
   * @param order 表示排序的字段
   * @param limit 表示分页的字段
   */
  private comQuery(
    fields: IFieldOptions[],
    tableName: string,
    where?: IRecords,
    order?: IField,
    limit?: ILimitOptions
  ): Promise<{ sql: string; data: IRecords[] }> {
    return new Promise((resolve, reject) => {
      let sql = `select ${sqlSplicing(fields)} from ${tableName}`
      if (where && typeof where === 'object' && Object.keys(where).length > 0) {
        sql += sqlWhereSplicing(where)
      }

      if (order && typeof order === 'object') {
        sql += orderSplicing(order)
      }

      if (limit && typeof limit === 'object' && Object.keys(limit).length > 0) {
        let { page = undefined, limit: nums = undefined } = limit
        if (page === undefined) page = 1
        if (nums === undefined) nums = 100000
        sql += ` limit ${page},${nums}`
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
  async findOne(fields: IFieldOptions[], tableName: string, where: IRecords): Promise<any> {
    try {
      // 判断字段是否为空
      isNullCheck(tableName, `表名 findOne`, INumeralTypes.TWO)
      isNullCheck(fields, `${tableName} findOne`, INumeralTypes.ONE)
      isNullCheck(where, `${tableName} findOne`, INumeralTypes.THREE)

      // 判断字段是否有效
      checkFieldsType(fields, ['string', 'object'], tableName)
      checkFieldsType(where, ['object'], tableName)

      const { sql, data } = await this.comQuery(fields, tableName, where)
      this.logRecords(sql)

      return data.length > 0 ? data[0] : null
    } catch (e) {
      this.emit('error', e)
      throw e
    }
  }

  /**
   * @author lihh
   * @description 用来查询多条数据
   * @param fields 查询的字段
   * @param tableName 需要的表名
   * @param where 以及查询的条件
   */
  find(fields: IFieldOptions[], tableName: string, where?: IRecords): Promise<any>
  find(fields: IFindOptions): Promise<any>
  async find(
    paramOptions: IFindOptions | IFieldOptions[],
    tableNameParam?: string,
    whereParam?: IRecords
  ): Promise<any> {
    try {
      let fields: IFindOptions | IFieldOptions[] | null = null,
        tableName: string | undefined = undefined,
        where: IRecords | undefined = undefined,
        order: IField = {},
        limit: ILimitOptions = { page: 1, limit: 100000 }

      // 判断参数是依次传递 还是按对象传递
      if (isObject(paramOptions)) {
        const {
          fields: param1,
          tableName: param2,
          where: param3,
          order: param4,
          limit: param5
        } = paramOptions as IFindOptions
        fields = param1
        tableName = param2
        where = param3
        order = param4 as IField
        limit = param5 as ILimitOptions
      } else {
        fields = paramOptions
        tableName = tableNameParam
        where = whereParam
      }

      // 判断参数是否有值
      isNullCheck(tableName, `为空表名 find`, INumeralTypes.TWO)
      isNullCheck(fields, `${tableName} find`, INumeralTypes.ONE)

      // 判断传递的参数是否有效
      checkFieldsType(fields, ['string', 'object'], tableName as string)
      where && checkFieldsType(where, ['object'], tableName as string)
      order && checkFieldsType(order, ['object'], tableName as string)
      limit && checkFieldsType(limit, ['object'], tableName as string)

      const { sql, data } = await this.comQuery(fields as IFieldOptions[], tableName as string, where, order, limit)
      this.logRecords(sql)
      return data
    } catch (e) {
      this.emit('error', e)
      throw e
    }
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
          return reject(0)
        }

        resolve(1)
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
          return reject(0)
        }

        resolve(1)
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
          return reject(0)
        }

        resolve(1)
      })
    })
  }
}

export default MysqlParse
