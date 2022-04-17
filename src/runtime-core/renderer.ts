import { effect } from '../reactivity/src'
import { ShapeFlags } from '../shared'
import { createComponentInstance, setupComponent } from './component'
import { createAppAPI } from './createApp'
import { Fragment, Text } from './vnode'

// 用于创建 render 函数
export function createRenderer(options) {
  /**
   * 通过解构赋值获取 createText 函数、createElement 函数、patchProp 函数、
   * insert 函数、remove 函数和 setElementText 函数
   */
  const {
    createText: hostCreateText,
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options

  // 用于对根组件对应的 VNode 进行处理
  function render(vnode, container) {
    patch(null, vnode, container, null)
  }

  // 用于处理 VNode
  function patch(n1, n2, container, parentComponent) {
    // 根据新 VNode 类型的不同调用不同的函数
    const { type, shapeFlag } = n2

    // 通过新 VNode 的 type property 判断 VNode 类型
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        // 通过新 VNode 的 shapeFlag property 与枚举变量 ShapeFlags 进行与运算来判断类型是 Element 或 Component
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent)
        }
        break
    }
  }

  // 用于处理 Fragment
  function processFragment(n1, n2, container, parentComponent) {
    mountChildren(n2.children, container, parentComponent)
  }

  // 用于处理 Text
  function processText(n1, n2, container) {
    // 通过解构赋值获取 Text 对应 VNode 的 children，即文本内容
    const { children } = n2
    // 根据文本内容创建文本节点
    const textNode = hostCreateText(children)
    // 将文本节点添加到根容器/其父元素中
    hostInsert(textNode, container)
  }

  // 用于处理 Element
  function processElement(n1, n2, container, parentComponent) {
    // 若旧 VNode 不存在则进行新 Element 的初始化
    if (!n1) {
      mountElement(n2, container, parentComponent)
    }
    // 否则进行 Element 的更新
    else {
      patchElement(n1, n2, container, parentComponent)
    }
  }

  // 用于进行 Element 的初始化
  function mountElement(vnode, container, parentComponent) {
    // 根据 Element 对应 VNode 的 type property 创建元素并赋值给 VNode 的 el property
    const el = (vnode.el = hostCreateElement(vnode.type))

    // 通过解构赋值获取 Element 对应 VNode 的 props 对象、shapeFlag property 和 children
    const { props, shapeFlag, children } = vnode

    // 遍历 props 对象，将其中的 property 或方法挂载到新元素上
    for (const key in props) {
      const val = props[key]
      hostPatchProp(el, key, val)
    }

    // 通过 VNode 的 shapeFlag property 与枚举变量 ShapeFlags 进行与运算来判断 children 类型
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el, parentComponent)
    }

    // 将新元素添加到根容器/父元素中
    hostInsert(el, container)
  }

  // 用于进行 Element 的更新
  function patchElement(n1, n2, container, parentComponent) {
    const oldProps = n1.props || {}
    const newProps = n2.props || {}

    // 将旧 VNode 的 el property 挂载到新 VNode 上
    const el = (n2.el = n1.el)

    patchChildren(n1, n2, el, parentComponent, anchor)
    patchProps(el, oldProps, newProps)
  }

  // 用于更新 Element 的 children
  function patchChildren(n1, n2, container, parentComponent) {
    // 通过结构赋值分别获得新旧 VNode 的 children 和 shapeFlag property
    const { children: c1, shapeFlag: prevShapeFlag } = n1
    const { children: c2, shapeFlag: nextShapeFlag } = n2

    // 若新 VNode 的 children 类型为 string
    if (nextShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 同时旧 VNode 的 children 类型为 Array
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 移除旧 VNode 的 children
        unmountChildren(c1)
      }

      // 若新旧 VNode 的 children 不同
      if (c1 !== c2) {
        // 将根容器/父元素的文本内容设置为新 VNode 的 children
        hostSetElementText(container, c2)
      }
    }
    // 若新 VNode 的 children 类型为 Array
    else if (nextShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 同时旧 VNode 的 children 类型为 string
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // 将根容器/父元素的文本内容设置为空字符串
        hostSetElementText(container, '')

        // 将新 VNode 的 children 添加到根容器/父元素中
        mountChildren(c2, container, parentComponent)
      }
      // 同时旧 VNode 的 children 类型为 Array
      else {
        // TODO: Array2Array
      }
    }
  }

  // 用于遍历 children，移除其中的所有 VNode
  function unmountChildren(children) {
    for (const child of children) {
      // 移除 VNode
      hostRemove(child)
    }
  }

  // 用于更新 Element 的 props
  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      // 遍历新 VNode 的 props 对象
      for (const key in newProps) {
        const prev = oldProps[key]
        const next = newProps[key]

        // 若新旧 VNode 的 props 对象中的 property 或方法不相等
        if (prev !== next) {
          // 将新 VNode 的 property 或方法挂载到元素上
          hostPatchProp(el, key, next)
        }
      }

      if (oldProps !== {}) {
        // 遍历旧 VNode 的 props 对象
        for (const key in oldProps) {
          // 若新 VNode 的 props 对象中不包含该 property 或方法
          if (!(key in newProps)) {
            // 将元素上该 property 或方法赋值为 null
            hostPatchProp(el, key, null)
          }
        }
      }
    }
  }

  // 用于遍历 children，对其中每个 VNode 调用 patch 方法进行处理
  function mountChildren(children, container, parentComponent, anchor) {
    for (const child of children) {
      patch(null, child, container, parentComponent, anchor)
    }
  }

  }

  // 用于处理 Component
  function processComponent(n1, n2, container, parentComponent) {
    mountComponent(n2, container, parentComponent)
  }

  // 用于进行 Component 的初始化
  function mountComponent(vnode, container, parentComponent) {
    // 通过组件对应的 VNode 创建组件实例对象，用于挂载 props、slots 等
    const instance = createComponentInstance(vnode, parentComponent)

    setupComponent(instance)

    setupRenderEffect(instance, vnode, container)
  }

  // 用于处理 VNode 树
  function setupRenderEffect(instance, vnode, container) {
    // 利用 effect 将调用 render 函数和 patch 方法的操作收集
    effect(() => {
      // 根据组件实例对象的 isMounted property 判断是初始化或更新 VNode 树
      // 若为 false 则是初始化
      if (!instance.isMounted) {
        // 通过解构赋值获取组件实例对象的 proxy property
        const { proxy } = instance

        // 调用组件实例对象中 render 函数获取 VNode 树，同时将 this 指向指定为 proxy property
        const subTree = (instance.subTree = instance.render.call(proxy))

        // 调用 patch 方法处理 VNode 树
        patch(null, subTree, container, instance)

        // 将 VNode 树的 el property 赋值给 VNode 的 el property
        vnode.el = subTree.el

        // 将组件实例对象的 isMounted property 赋值为 true
        instance.isMounted = true
      }
      // 否则是更新
      else {
        // 通过解构赋值获取组件实例对象的 proxy property 和旧 VNode 树
        const { proxy, subTree: preSubTree } = instance

        // 调用组件实例对象中 render 函数获取新 VNode 树，同时将 this 指向指定为 proxy property
        const subTree = (instance.subTree = instance.render.call(proxy))

        // 调用 patch 方法处理新旧 VNode 树
        patch(preSubTree, subTree, container, instance)
      }
    })
  }

  // 返回一个包含 createApp 的对象，方法具体为调用 createAppAPI 函数并传入 render 函数
  return {
    createApp: createAppAPI(render)
  }
}
