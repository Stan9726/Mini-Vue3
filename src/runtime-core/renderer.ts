import { isObject } from '../shared'
import { createComponentInstance, setupComponent } from './component'

// 用于对根组件对应的 VNode 进行处理
export function render(vnode, container) {
  patch(vnode, container)
}

// 用于处理组件对应的 VNode
function patch(vnode, container) {
  // 根据 VNode 类型的不同调用不同的函数
  // 通过 VNode 的 type property 的类型来判断 VNode 类型
  // 若 type property 的类型是 string，则 VNode 类型是 Element
  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
  }
  // 若 type property 的类型是 object，则 VNode 类型是 Component
  else if (isObject(vnode.type)) {
    processComponent(vnode, container)
  }
}

// 用于处理 Element
function processElement(vnode, container) {
  mountElement(vnode, container)
}

// 用于进行 Element 的初始化
function mountElement(vnode, container) {
  // 根据 Element 对应 VNode 的 type property 创建 DOM 元素并同时赋值给变量 el 和 VNode 的 el property
  const el = (vnode.el = document.createElement(vnode.type))

  // 通过解构赋值获取 Element 对应 VNode 的 props property 和 children property
  const { props, children } = vnode

  // 遍历 props，利用 Element.setAttribute() 将其中的 property 添加到 el 上
  // 其中 key 作为 el 的 attribute 或 property 名，value 作为 attribute 或 property 的值
  for (const key in props) {
    const val = props[key]
    el.setAttribute(key, val)
  }

  // 若 children 的类型是 string，则将其赋值给 el 的 textContent property
  if (typeof children === 'string') {
    el.textContent = children
  }
  // 若 children 的类型是 Array，则调用 mountChildren 函数
  else if (Array.isArray(children)) {
    mountChildren(children, el)
  }

  // 利用 Element.append() 将 el 添加到根容器/其父元素中
  container.append(el)
}

// 用于遍历 children，对其中每个 VNode 调用 patch 方法进行处理
function mountChildren(children, container) {
  children.forEach(child => {
    patch(child, container)
  })
}

// 用于处理 Component
function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

// 用于进行 Component 的初始化
function mountComponent(vnode, container) {
  // 通过组件对应的 VNode 创建组件实例对象，用于挂载 props、slots 等
  const instance = createComponentInstance(vnode)

  setupComponent(instance)

  setupRenderEffect(instance, vnode, container)
}

// 用于获取 VNode 树并递归地处理
function setupRenderEffect(instance, vnode, container) {
  // 通过解构赋值获取组件实例对象的 proxy property
  const { proxy } = instance

  // 调用组件实例对象中 render 函数获取 VNode 树，同时将 this 指向指定为 proxy property
  const subTree = instance.render.call(proxy)

  // 调用 patch 方法递归地处理 VNode 树
  patch(subTree, container)

  // 将 VNode 树的 el property 赋值给 VNode 的 el property
  vnode.el = subTree.el
}
