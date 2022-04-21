// 用于判断组件是否需要更新
export function shouldUpdateComponent(prevVNode, nextVNode): boolean {
  const { props: prevProps } = prevVNode
  const { props: nextProps } = nextVNode

  // 对比新旧 VNode 的 props 对象，若不相等则返回 true，否则返回 false
  for (const key in nextProps) {
    if (nextProps[key] !== prevProps[key]) {
      return true
    }
  }

  return false
}
