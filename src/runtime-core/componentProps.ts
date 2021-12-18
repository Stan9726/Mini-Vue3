// 用于 props 对象赋值给组件实例对象的 props property
export function initProps(instance, rawProps) {
  instance.props = rawProps || {}
}
