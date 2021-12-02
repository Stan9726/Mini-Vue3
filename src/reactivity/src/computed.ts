import { ReactiveEffect } from './effect'

// Ref 接口的实现类
class ComputedImpl {
  // 用于保存 ReactiveEffect 类的实例
  private _effect: ReactiveEffect
  // 用于保存 getter 函数的执行结果
  private _value
  // 用于记录是否不使用缓存
  private _dirty = true

  constructor(getter) {
    // 利用 getter 函数和一个方法创建 ReactiveEffect 类的实例
    this._effect = new ReactiveEffect(
      getter,
      // 用于关闭缓存
      () => {
        this._dirty = true
      }
    )
  }

  // value property 的 get 返回调用私有 property _effect 的 run 方法的返回值，即调用 getter 函数的返回值
  get value() {
    if (this._dirty) {
      // 调用 ReactiveEffect 类的实例的 run 方法，即执行 getter 函数，将结果赋值给 _value property
      this._value = this._effect.run()
      this._dirty = false
    }

    return this._value
  }
}

export function computed(getter) {
  // 返回 RefImpl 类的实例，即 ref 对象
  return new ComputedImpl(getter)
}
