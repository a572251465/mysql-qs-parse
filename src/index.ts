import { Connection } from 'mysql'
import { IConnectConfigOptions, IField, IRecords } from './types'

// import Events = require('events')
// const EventEmitter = require('events')
import * as events from 'events'
import * as mysql from 'mysql'

let parseInstance: MysqlParse | null

class MysqlParse extends events.EventEmitter {
  public db: Connection | null = null
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
      const { host, user, password, database } = this.host
      this.host = host
      this.user = user
      this.password = password
      this.database = database
    }

    if (parseInstance === null) {
      parseInstance = this
    } else {
      return parseInstance
    }
  }

  /**
   * @author lihh
   * @description 打开mysql连接
   */
  open() {
    const { host, user, password, database } = this
    const connection = mysql.createConnection({ host: host as string, user, password, database })
    connection.connect((err) => {
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
      this.db.end((err) => {
        if (err) {
          this.emit('error', err)
        } else {
          this.emit('close')
          this.db = null
        }
      })
    }
  }

  /**
   * @author lihh
   * @description 进行单个数据查询
   * @param fields 查询的字段
   * @param tableName 需要的表名
   * @param where 以及查询的条件
   */
  findOne(fields: IField, tableName: string, where: IRecords) {}

  /**
   * @author lihh
   * @description 表示对数据进行插入
   * @param fields 表示插入的字段
   * @param tableName 表示表名
   */
  insert(fields: IRecords, tableName: string) {}

  /**
   * @author lihh
   * @description 表示对表数据进行更新
   * @param fields 表示更新的字段
   * @param tableName 表示更新的表
   * @param where 表示更新的条件
   */
  update(fields: IRecords, tableName: string, where: IRecords) {}

  /**
   * @author lihh
   * @description 表示对数据进行删除 如果传递了删除字段就是逻辑删除 反之就是物理删除
   * @param tableName 表示删除的表
   * @param where 删除的条件
   * @param fields 逻辑删除更新的字段
   */
  delete(tableName: string, where: IRecords, fields?: IRecords) {}
}

export default MysqlParse
