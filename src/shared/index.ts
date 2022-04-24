// 为 Object.assign 方法创建别名
export const extend = Object.assign

// 用于判断一个变量是否为对象
export const isObject = value => typeof value === 'object' && value !== null

export const isString = value => typeof value === 'string'

// 用于判断两个值或对象是否相等
export const hasChanged = (value, oldValue): boolean =>
  !Object.is(value, oldValue)

// 用于判断对象中是否有某个 property
export const hasOwn = (val, key) =>
  Object.prototype.hasOwnProperty.call(val, key)

// 用于将带连字符的字符串转换为驼峰式
export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : ''
  })
}

// 用于将字符串首字母转换为大写
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// 用于在字符串之前加上 on
export const toHandlerKey = (str: string) => {
  return str ? 'on' + capitalize(str) : ''
}

export * from './shapeFlags'

export * from './toDisplayString'
