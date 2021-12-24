import { PoolConfig } from 'mysql'

export interface IRecords {
  [keyName: string]: any
}

export interface IField<T = string | IRecords> {
  [keyName: string]: T
}

export interface IResultRecords {
  RowDataPacket: IRecords
}

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
