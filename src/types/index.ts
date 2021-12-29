import { PoolConfig } from 'mysql'

export interface IRecords {
  [keyName: string]: any
}

type IPartOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export interface IField<T = string | IRecords> {
  [keyName: string]: T
}

export type IFieldOptions = IField | string

export interface IResultRecords {
  RowDataPacket: IRecords
}

export interface ILimitOptions {
  page: number
  limit: number
}

export type IFindOptions = IPartOptional<
  {
    fields: IFieldOptions[]
    tableName: string
    where: IRecords
    order: IField
    limit: ILimitOptions
  },
  'where' | 'order' | 'limit'
>

export type ICheckOptions = string | IField

type IPartRequired<T, K extends keyof T> = { [p in K]-?: T[p] } & Omit<T, K>

export type IConnectConfigOptions = IPartRequired<PoolConfig, 'host' | 'user' | 'password' | 'database'>

export type IValueChange<T> = T[keyof T]

export enum INumeralTypes {
  ONE = 'one',
  TWO = 'two',
  THREE = 'three',
  FOUR = 'four',
  FIVE = 'five'
}
