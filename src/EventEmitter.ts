interface IFn {
  (...args: any[]): void
}
interface IOptions {
  [keyName: string]: IFn[]
}

class EventEmitter {
  private pool: IOptions = {}
  constructor() {}

  /**
   * @author lihh
   * @description 进行简单的发布订阅
   * @param keyName 订阅key值
   * @param fn 订阅方法
   */
  on(keyName: string, fn: IFn) {
    const arr = this.pool[keyName] || (this.pool[keyName] = [])
    if (arr.includes(fn)) return

    arr.push(fn)
  }

  /**
   * @author lihh
   * @description 订阅一次后 直接取消
   * @param keyName 订阅名称
   * @param fn 执行函数
   */
  once(keyName: string, fn: IFn) {
    const newFn: IFn & { l: IFn } = (...args: any[]) => {
      fn(...args)
      this.off(keyName, fn)
    }
    newFn.l = fn
    this.on(keyName, newFn)
  }

  /**
   * @author lihh
   * @description 取消订阅
   * @param keyName 订阅名称
   * @param fn 函数
   */
  off(keyName: string, fn: IFn & { l?: IFn }) {
    const arr = this.pool[keyName] || (this.pool[keyName] = [])
    if (arr.length === 0) return

    this.pool[keyName] = arr.filter((method) => method !== fn && method !== fn.l)
  }

  /**
   * @author lihh
   * @description 进行订阅函数发布
   * @param keyName 订阅名称
   * @param args 剩余参数
   */
  emit(keyName: string, ...args: any[]) {
    const arr = this.pool[keyName] || []
    arr.forEach((fn) => fn(...args))
  }
}

export default EventEmitter
