import { Connection, PoolConfig } from 'mysql'
type IPartOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type IPartRequired<T, K extends keyof T> = { [p in K]-?: T[p] } & Omit<T, K>
type IConnectConfigOptions = IPartRequired<PoolConfig, 'host' | 'user' | 'password' | 'database'>
interface IRecords {
  [keyName: string]: any
}
interface IField<T = string | IRecords> {
  [keyName: string]: T
}
type IFieldOptions = IField | string
interface ILimitOptions {
  page: number
  limit: number
}
type IFindOptions = IPartOptional<
  {
    fields: IFieldOptions[]
    tableName: string
    where: IRecords
    order: IField
    limit: ILimitOptions
  },
  'where' | 'order' | 'limit'
>
interface IFn {
  (...args: any[]): void
}

declare class SqlParse {
  public db: Connection | null
  constructor(host: string, user: string, password: string, database: string)
  constructor(host: IConnectConfigOptions, user?: string, password?: string, database?: string)

  open(): Promise<Connection>
  release(): void
  query(sql: string): Promise<any>
  size(tableName: string, where?: IRecords): Promise<number>
  findOne(fields: IFieldOptions[], tableName: string, where: IRecords): Promise<IRecords>
  find(fields: IFieldOptions[], tableName: string, where?: IRecords): Promise<IRecords[]>
  find(fields: IFindOptions): Promise<IRecords[]>
  insert(fields: IRecords, tableName: string): Promise<number>
  update(fields: IRecords, tableName: string, where: IRecords): Promise<number>
  delete(tableName: string, where: IRecords, fields?: IRecords): Promise<number>
  on(keyName: string, fn: IFn): void
  once(keyName: string, fn: IFn): void
  emit(keyName: string, ...args: any[]): void
  off(keyName: string, fn: IFn & { l?: IFn }): void
}

interface MysqlParse {
  new (host: string, user: string, password: string, database: string): SqlParse
  new (host: IConnectConfigOptions, user?: string, password?: string, database?: string): SqlParse
}

declare const SqlParser: MysqlParse
export = SqlParser
