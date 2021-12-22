import { ConnectionConfig } from 'mysql'

export interface IRecords {
  [keyName: string]: any
}

export interface IField {
  [keyName: string]: string | IRecords
}

type IPartRequired<T, K extends keyof T> = { [p in K]-?: T[p] } & Omit<T, K>

export type IConnectConfigOptions = IPartRequired<ConnectionConfig, 'host' | 'user' | 'password' | 'database'>
