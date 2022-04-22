import {
  h,
  ref,
  getCurrentInstance,
  nextTick
} from '../../lib/mini-vue3.esm.js'

export default {
  name: 'App',
  setup() {
    // 响应式数据
    const count = ref(0)
    const instance = getCurrentInstance()

    function onPlus() {
      // 修改响应式数据
      count.value++

      // 同步获取视图中显示的内容
      console.log(instance.vnode.el.childNodes[0].innerHTML)

      // 在 nextTick 的回调函数中获取视图中显示的内容
      nextTick(() => {
        console.log(instance.vnode.el.childNodes[0].innerHTML)
      })
    }

    async function onMinus() {
      // 修改响应式数据
      count.value--

      // 同步获取视图中显示的内容
      console.log(instance.vnode.el.childNodes[0].innerHTML)

      // 等待 nextTick 执行后再获取视图中显示的内容
      await nextTick()
      console.log(instance.vnode.el.childNodes[0].innerHTML)
    }

    return {
      count,
      onPlus,
      onMinus
    }
  },
  render() {
    return h('div', {}, [
      h('p', {}, `count: ${this.count}`),
      h('button', { onClick: this.onPlus }, 'plus 1'),
      h('button', { onClick: this.onMinus }, 'minus 1')
    ])
  }
}
