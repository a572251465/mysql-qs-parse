import { ConnectionConfig } from 'mysql'

export interface IRecords {
  [keyName: string]: any
}

export interface IField {
  [keyName: string]: string | IRecords
}

export interface IResultRecords {
  RowDataPacket: IRecords
}

export type ICheckOptions = string | IField

type IPartRequired<T, K extends keyof T> = { [p in K]-?: T[p] } & Omit<T, K>

export type IConnectConfigOptions = IPartRequired<ConnectionConfig, 'host' | 'user' | 'password' | 'database'>

export enum INumeralTypes {
  ONE = 'one',
  TWO = 'two',
  THREE = 'three',
  FOUR = 'four',
  FIVE = 'five'
}
