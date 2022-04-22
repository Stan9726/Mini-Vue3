import { effect } from '../reactivity/src'
import { ShapeFlags } from '../shared'
import { createComponentInstance, setupComponent } from './component'
import { shouldUpdateComponent } from './componentUpdateUtils'
import { createAppAPI } from './createApp'
import { queueJobs } from './scheduler'
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
    patch(null, vnode, container, null, null)
  }

  // 用于处理 VNode
  function patch(n1, n2, container, parentComponent, anchor) {
    // 根据新 VNode 类型的不同调用不同的函数
    const { type, shapeFlag } = n2

    // 通过新 VNode 的 type property 判断 VNode 类型
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        // 通过新 VNode 的 shapeFlag property 与枚举变量 ShapeFlags 进行与运算来判断类型是 Element 或 Component
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent, anchor)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent, anchor)
        }
        break
    }
  }

  // 用于处理 Fragment
  function processFragment(n1, n2, container, parentComponent, anchor) {
    mountChildren(n2.children, container, parentComponent, anchor)
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
  function processElement(n1, n2, container, parentComponent, anchor) {
    // 若旧 VNode 不存在则初始化 Element
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor)
    }
    // 否则更新 Element
    else {
      patchElement(n1, n2, container, parentComponent, anchor)
    }
  }

  // 用于初始化 Element
  function mountElement(vnode, container, parentComponent, anchor) {
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
      mountChildren(children, el, parentComponent, anchor)
    }

    // 将新元素添加到根容器/父元素中
    hostInsert(el, container, anchor)
  }

  // 用于更新 Element
  function patchElement(n1, n2, container, parentComponent, anchor) {
    const oldProps = n1.props || {}
    const newProps = n2.props || {}

    // 获取旧 VNode 的 el property 并将其挂载到新 VNode 上
    const el = (n2.el = n1.el)

    patchChildren(n1, n2, el, parentComponent, anchor)
    patchProps(el, oldProps, newProps)
  }

  // 用于更新 Element 的 children
  function patchChildren(n1, n2, container, parentComponent, anchor) {
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
        mountChildren(c2, container, parentComponent, anchor)
      }
      // 同时旧 VNode 的 children 类型为 Array
      else {
        patchKeyedChildren(c1, c2, container, parentComponent, anchor)
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

  // 用于针对数组情况更新 Element 的 children
  function patchKeyedChildren(
    c1,
    c2,
    container,
    parentComponent,
    parentAnchor
  ) {
    const l2 = c2.length
    // 用于双端对比的指针（索引）
    let i = 0
    let e1 = c1.length - 1
    let e2 = l2 - 1

    // 用于判断两个元素是否是同一 VNode
    function isSameVNodeType(n1, n2) {
      // 若 type property 和 key property 均相同则返回 true
      return n1.type === n2.type && n1.key === n2.key
    }

    // 从头遍历
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]

      // 若两个元素是同一 VNode 则对其调用 patch 方法进行更新
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      }
      // 否则结束遍历，此时 i 为从头遍历时差异位置在两个数组中的索引
      else {
        break
      }

      i++
    }

    // 从尾遍历
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]

      // 若两个元素是同一 VNode 则对其调用 patch 方法进行更新
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      }
      // 否则结束遍历，此时 e1 和 e2 分别为从尾遍历时差异位置在两个数组中的索引
      else {
        break
      }

      e1--
      e2--
    }

    // 若 i > e1 则说明新的数组比旧的长，将多出的元素依次向旧的中插入
    if (i > e1) {
      if (i <= e2) {
        // 要插入位置的下一个元素的索引是 e2+1
        const nextPos = e2 + 1
        // 若 e2+1 小于新的数组长度，则锚点为新的数组中索引为 e2+1 的 VNode 的 el property，否则为 null
        const anchor = nextPos < l2 ? c2[nextPos].el : null

        // 依次对子数组[i,e2]中的 VNode 调用 patch 方法进行插入
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor)

          i++
        }
      }
    }
    // 若 i > e2 则说明旧的数组比新的长，将多出的元素依次从旧的中移除
    else if (i > e2) {
      // 依次移除子数组[i,e1]中的 VNode
      while (i <= e1) {
        hostRemove(c1[i].el)

        i++
      }
    }
    // 若 i <= e1 且 i <= e2 则说明子数组[i,e1]和子数组[i,e2]有差异
    else {
      let s = i

      // 用于保存需要调用 patch 方法的次数
      const toBePatched = e2 - s + 1
      // 用于记录调用 patch 方法的次数
      let patched = 0

      // 用于保存子数组[i,e2]中元素的索引，key 为 VNode 的 key property，value 为索引
      const keyToNewIndexMap = new Map()
      // 用于保存子数组[i,e2]中元素在旧的数组中的索引，默认为 0，在保存时加 1
      const newIndexToOldIndexMap = new Array(toBePatched)
      // 用于标志是否存在元素移动
      let moved = false
      // 用于保存遍历子数组[i,e1]时其中元素在新的数组中的最大索引
      let maxNewIndexSoFar = 0

      for (let i = 0; i < toBePatched; i++) {
        newIndexToOldIndexMap[i] = 0
      }

      // 遍历子数组[i,e2]，保存其中元素的索引
      for (let i = s; i <= e2; i++) {
        const nextChild = c2[i]

        keyToNewIndexMap.set(nextChild.key, i)
      }

      // 遍历子数组[i,e1]，依次进行处理
      for (let i = s; i <= e1; i++) {
        const prevChild = c1[i]

        // 若 patched 大于等于 toBePatched，则说明当前元素是要移除的元素，可直接移除
        if (patched >= toBePatched) {
          hostRemove(prevChild.el)

          continue
        }

        let newIndex
        // 若当前元素包含 key property，则从 keyToNewIndexMap 中获取其在新的数组中的索引
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        }
        // 否则
        else {
          // 遍历子数组[i,e2]获取其索引
          for (let j = s; j <= e2; j++) {
            if (isSameVNodeType(prevChild, c2[j])) {
              newIndex = j

              break
            }
          }
        }

        // 若当前元素在新的数组中的索引不存在则其不在新的数组中，可直接移除
        if (newIndex === undefined) {
          hostRemove(prevChild.el)
        }
        // 否则对当前元素调用 patch 方法进行更新
        else {
          // 若当前元素在新的数组中的索引大于等于 maxNewIndexSoFar，则更新后者
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
          }
          // 否则说明存在元素移动，将 moved 的值变为 true
          else {
            moved = true
          }

          // 保存当前元素在旧的数组中的索引
          newIndexToOldIndexMap[newIndex - s] = i + 1
          // 对当前元素调用 patch 方法进行更新
          patch(prevChild, c2[newIndex], container, parentComponent, null)

          patched++
        }
      }

      /**
       * 用于保存最长递增子序列
       * 若 moved 为 true 则存在元素移动
       * 通过 getSequence() 函数获取 newIndexToOldIndexMap 的最长递增子序列
       */
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : []
      // 用于倒序遍历最长递增子序列
      let j = increasingNewIndexSequence.length - 1

      // 倒序遍历子数组[i,e2]，依次进行处理
      for (let i = toBePatched - 1; i >= 0; i--) {
        // 用于保存当前元素在新的数组中的索引
        const nextIndex = i + s
        const nextChild = c2[nextIndex]
        /**
         * 若 nextIndex+1 小于新的数组长度
         * 则锚点为新的数组中索引为 nextIndex+1 的 VNode 的 el property
         * 否则为 null
         */
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null

        /**
         * 若在 newIndexToOldIndexMap 中当前元素在子数组[i,e2]索引对应的值为 0
         * 则说明该元素不在旧的数组中，对其调用 patch 方法进行插入
         */
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, parentComponent, anchor)
        }
        // 若存在元素移动
        else if (moved) {
          /**
           * 若 j 小于 0，即最长递增子序列已遍历完
           * 或者当前元素在子数组[i,e2]索引与最长递增子序列中索引为 j 的值不相等
           * 则说明当前元素是要移动的元素
           */
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            // 将当前元素插入到其要移动到的位置
            hostInsert(nextChild.el, container, anchor)
          } else {
            j--
          }
        }
      }
    }
  }

  // 用于处理 Component
  function processComponent(n1, n2, container, parentComponent, anchor) {
    // 若旧 VNode 不存在则初始化 Component
    if (!n1) {
      mountComponent(n2, container, parentComponent, anchor)
    }
    // 否则更新 Component
    else {
      updateComponent(n1, n2)
    }
  }

  // 用于初始化 Component
  function mountComponent(vnode, container, parentComponent, anchor) {
    // 通过组件对应的 VNode 创建组件实例对象，用于挂载 props、slots 等，并将其挂载到 VNode 上
    const instance = (vnode.component = createComponentInstance(
      vnode,
      parentComponent
    ))

    setupComponent(instance)

    setupRenderEffect(instance, vnode, container, anchor)
  }

  // 用于更新 Component
  function updateComponent(n1, n2) {
    // 获取旧 VNode 对应组件实例对象并将其挂载到新 VNode 上
    const instance = (n2.component = n1.component)

    // 若需要更新组件
    if (shouldUpdateComponent(n1, n2)) {
      // 将新 VNode 挂载到组件实例对象上
      instance.next = n2
      // 调用组件实例对象的 update 方法
      instance.update()
    }
    // 否则
    else {
      // 将旧 VNode 的 el property 挂载到新 VNode 上
      n2.el = n1.el
      // 将新 VNode 挂载到组件实例对象上
      instance.vnode = n2
    }
  }

  // 用于处理 VNode 树
  function setupRenderEffect(instance, vnode, container, anchor) {
    // 利用 effect 将调用 render 函数和 patch 方法的操作收集，并将 effect 返回的函数保存为组件实例对象的 update 方法
    instance.update = effect(
      () => {
        // 根据组件实例对象的 isMounted property 判断是初始化或更新 VNode 树
        // 若为 false 则是初始化
        if (!instance.isMounted) {
          // 通过解构赋值获取组件实例对象的 proxy property
          const { proxy } = instance

          // 调用组件实例对象中 render 函数获取 VNode 树，同时将 this 指向指定为 proxy property，并将其挂载到组件实例对象上
          const subTree = (instance.subTree = instance.render.call(proxy))

          // 调用 patch 方法处理 VNode 树
          patch(null, subTree, container, instance, anchor)

          // 将 VNode 树的 el property 赋值给 VNode 的 el property
          vnode.el = subTree.el

          // 将组件实例对象的 isMounted property 赋值为 true
          instance.isMounted = true
        }
        // 否则是更新
        else {
          // 通过解构赋值获取组件对应新旧 VNode 以及组件实例对象的 proxy property 和旧 VNode 树
          const { next, vnode, proxy, subTree: preSubTree } = instance

          if (next) {
            // 将旧 VNode 的 el property 挂载到新 VNode 上
            next.el = vnode.el

            updateComponentPreRender(instance, next)
          }

          // 调用组件实例对象中 render 函数获取新 VNode 树，同时将 this 指向指定为 proxy property，并将其挂载到组件实例对象上
          const subTree = (instance.subTree = instance.render.call(proxy))

          // 调用 patch 方法处理新旧 VNode 树
          patch(preSubTree, subTree, container, instance, anchor)
        }
      },
      // 传入包含 scheduler 方法的对象作为第二个参数
      {
        // 在 scheduler 方法中将组件实例对象的 update 方法保存到队列中
        scheduler() {
          queueJobs(instance.update)
        }
      }
    )
  }

  // 返回一个包含 createApp 的对象，方法具体为调用 createAppAPI 函数并传入 render 函数
  return {
    createApp: createAppAPI(render)
  }
}

// 用于更新组件实例对象的 property
function updateComponentPreRender(instance, nextVNode) {
  instance.vnode = nextVNode
  instance.next = null
  instance.props = nextVNode.props
}

function getSequence(arr: number[]): number[] {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = (u + v) >> 1
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}
