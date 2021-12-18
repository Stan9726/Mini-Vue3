// 用于判断 VNode 的 shapeFlag
export const enum ShapeFlags {
  // 用于判断 VNode 类型是否是 Element
  ELEMENT = 1, // 0001
  // 用于判断 VNode 类型是否是 Component
  STATEFUL_COMPONENT = 1 << 1, // 0010
  // 用于判断 children 类型是否是 string
  TEXT_CHILDREN = 1 << 2, // 0100
  // 用于判断 children 类型是否是 Array
  ARRAY_CHILDREN = 1 << 3 // 1000
}
