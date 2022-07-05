import Singleton from 'db://assets/Base/Singleton'

interface IItem {
  func: Function
  ctx: unknown
}

export class EventManager extends Singleton {
  static get Instance() {
    return super.GetInstance<EventManager>()
  }

  private eventDic: Map<string, Array<IItem>> = new Map()

  //绑定事件
  on(name: string, func: Function, ctx?: unknown) {
    if (this.eventDic.has(name)) {
      this.eventDic.get(name).push({ func, ctx })
    } else {
      this.eventDic.set(name, [{ func, ctx }])
    }
  }

  //解绑
  off(name: string, func: Function) {
    if (this.eventDic.has(name)) {
      const index = this.eventDic.get(name).findIndex(i => i.func === func)
      if (index > -1) {
        this.eventDic.get(name).splice(index, 1)
      }
    }
  }

  //触发事件
  emit(name: string, ...params: unknown[]) {
    if (this.eventDic.has(name)) {
      this.eventDic.get(name).forEach(({ func, ctx }) => {
        ctx ? func.apply(ctx, params) : func(params)
      })
    }
  }

  //清除事件
  clear() {
    this.eventDic.clear()
  }
}
