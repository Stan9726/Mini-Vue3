import { CREATE_ELEMENT_VNODE } from '../runtimeHelpers'
import { NodeTypes } from '../ast'

export function transformElement(node, context) {
  if (node.type === NodeTypes.ELEMENT) {
    context.helper(CREATE_ELEMENT_VNODE)
  }
}
