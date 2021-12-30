import { shallowReadonly } from '../reactivity'
import { emit } from './componentEmit'
import { initProps } from './componentProps'
import { PublicInstanceHandlers } from './componentPublicInstance'
import { initSlots } from './componentSlots'

// 用于创建组件实例对象
export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    emit: () => {}
  }

  // 通过 Function.prototype.bind() 将 emit 函数第一个参数指定为组件实例对象，将新函数赋值给组件实例对象的 emit 方法
  component.emit = emit.bind(null, component) as any

  return component
}

// 用于初始化 props、初始化 slots 和调用 setup 方法以及设置 render 函数
export function setupComponent(instance) {
  // 将组件对应 VNode 的 props property 赋值给组件实例对象的 props property
  initProps(instance, instance.vnode.props)

  // 若 children 为插槽则将其挂载到组件实例对象的 slots property 上
  initSlots(instance, instance.vnode.children)

  setupStatefulComponent(instance)
}

// 用于初始化有状态的组件（相对的是没有状态的函数式组件）
function setupStatefulComponent(instance) {
  // 通过组件实例对象的 type property 获取组件选项对象
  const Component = instance.type

  // 利用 Proxy 对组件实例对象的 proxy property 的 get 进行代理
  instance.proxy = new Proxy({ _: instance }, PublicInstanceHandlers)

  // 通过解构赋值获取组件选项对象中的 setup 方法
  const { setup } = Component

  // 若组件选项对象中包含 setup 方法则调用该方法并处理其返回值
  if (setup) {
    // 调用 setup 方法传入 props 对象和包含 emit 方法的对象并获取其返回值
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    })

    // 处理 setup 方法的返回值
    handleSetupResult(instance, setupResult)
  }
}

// 用于处理 setup 方法的返回值
function handleSetupResult(instance, setupResult) {
  // 根据 setup 方法返回值类型的不同进行不同的处理
  // 若返回一个 object 则将其注入到组件的上下文中
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }
  // 若返回一个 function 则将其作为组件的 render 函数
  else if (typeof setupResult === 'function') {
    // TODO: 处理 function
  }

  finishComponentSetup(instance)
}

// 用于设置 render 函数
function finishComponentSetup(instance) {
  // 通过组件实例对象的 type property 获取组件选项对象
  const Component = instance.type

  // 若组件选项对象中包含 render 函数则将其赋值给组件实例对象的 render 方法
  if (Component.render) {
    instance.render = Component.render
  }
}
