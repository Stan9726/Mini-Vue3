import { extend, isObject } from '../../shared'
import { track, trigger } from './effect'
import { reactive, readonly } from './reactive'

// 对 get 和 set 进行缓存，防止重复调用工具函数
const get = createGetter()
const readonlyGet = createGetter(true)
const shallowGet = createGetter(false, true)
const shallowReadonlyGet = createGetter(true, true)
const set = createSetter()

// 用于保存 isReactive 和 isReadonly 中使用的特殊 property 的名
export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

// 用于生成 get 函数的工具函数
function createGetter(isReadonly = false, shallow = false) {
  return function (target, key) {
    // 当 property 名为 __v_isReactive 时，表明正在调用 isReactive，直接返回 !isReadonly
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }
    // 当 property 名为 __v_isReadonly 时，表明正在调用 isReadonly，直接返回 isReadonly
    else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    const res = Reflect.get(target, key)

    // 利用 reactive 和 shallowReactive 进行响应式转换时才进行依赖收集
    if (!isReadonly) {
      // 收集依赖
      track(target, key)
    }

    // 若利用 shallowReactive 和 shallowReadonly 进行响应式转换则直接返回
    if (shallow) {
      return res
    }

    // 若 property 的值为对象，则利用 reactive 和 readonly 进行响应式转换
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}

// 用于生成 set 函数的工具函数
function createSetter() {
  return function (target, key, value) {
    const res = Reflect.set(target, key, value)
    // 触发依赖
    trigger(target, key)
    return res
  }
}

// reactive 对应的 handlers
export const mutableHandlers = {
  get,
  set
}

// readonly 对应的 handlers
export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    // 调用 console.warn 发出警告
    console.warn(
      `Set operation on key "${key}" failed: target is readonly.`,
      target
    )
    return true
  }
}

// shallowRreactive 对应的 handlers 是由 mutableHandlers 替换 get property 得到的
export const shallowHandlers = extend({}, mutableHandlers, {
  get: shallowGet
})

// shallowReadonly 对应的 handlers 是由 readonlyHandlers 替换 get property 得到的
export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
})
