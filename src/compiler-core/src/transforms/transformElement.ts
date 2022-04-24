import { createVNodeCall, NodeTypes } from '../ast'

export function transformElement(node, context) {
  if (node.type === NodeTypes.ELEMENT) {
    return () => {
      const { tag, children } = node

      let vnodeTag = `'${tag}'`
      let vnodeProps
      let vnodeChildren = children[0]

      node.codegenNode = createVNodeCall(
        context,
        vnodeTag,
        vnodeProps,
        vnodeChildren
      )
    }
  }
}
