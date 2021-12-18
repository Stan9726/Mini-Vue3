// 为 Object.assign 方法创建别名
export const extend = Object.assign

// 用于判断一个变量是否为对象
export const isObject = value => typeof value === 'object' && value !== null

// 用于判断两个值或对象是否相等
export const hasChanged = (value, oldValue): boolean =>
  !Object.is(value, oldValue)

// 用于判断对象中是否有某个 property
export const hasOwn = (val, key) =>
  Object.prototype.hasOwnProperty.call(val, key)

export * from './ShapeFlags'
