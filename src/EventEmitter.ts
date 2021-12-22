interface IFn {
  (...args: any[]): void
}
interface IOptions {
  [keyName: string]: IFn[]
}

class EventEmitter {
  private pool: IOptions = {}
  constructor() {
  }

  /**
   * @author lihh
   * @description 进行简单的发布订阅
   * @param keyName 订阅key值
   * @param fn 订阅方法
   */
  on(keyName: string, fn: IFn) {
    const arr = (this.pool[keyName] || (this.pool[keyName] = []))
    if (arr.includes(fn)) return

    arr.push(fn)
  }

  /**
   * @author lihh
   * @description 进行订阅函数发布
   * @param keyName 订阅名称
   * @param args 剩余参数
   */
  emit(keyName: string, ...args: any[]) {
    const arr = this.pool[keyName] || []
    arr.forEach(fn => fn(...args))
  }
}

export default EventEmitter
