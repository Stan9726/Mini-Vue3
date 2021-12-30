// 用于判断 VNode 的 shapeFlag property
export const enum ShapeFlags {
  // 用于判断 VNode 类型是否是 Element
  ELEMENT = 1, // 00001
  // 用于判断 VNode 类型是否是 Component
  STATEFUL_COMPONENT = 1 << 1, // 00010
  // 用于判断 children 类型是否是 string
  TEXT_CHILDREN = 1 << 2, // 00100
  // 用于判断 children 类型是否是 Array
  ARRAY_CHILDREN = 1 << 3, // 01000
  // 用于判断 children 是否是插槽
  SLOTS_CHILDREN = 1 << 4 // 10000
}
