// 为 Object.assign 方法创建别名
export const extend = Object.assign

// 用于判断一个变量是否为对象
export const isObject = value => typeof value === 'object' && value !== null
