import { h } from '../../lib/mini-vue3.esm.js'

// Foo 组件选项对象
export const Foo = {
  setup(props, { emit }) {
    const emitBar = () => {
      console.log('emit bar')
      // 通过 emit 触发使用 Foo 组件时在 props 对象中声明的 onBar 方法
      emit('bar', 1, 2)
    }

    const emitBarBaz = () => {
      console.log('emit bar baz')
      // 通过 emit 触发使用 Foo 组件时在 props 对象中声明的 onBarBaz 方法
      emit('bar-baz', 3, 4)
    }

    return {
      emitBar,
      emitBarBaz
    }
  },
  render() {
    const btnBar = h(
      'button',
      {
        // 在 render 函数中通过 this 获取 setup 返回对象的方法
        onClick: this.emitBar
      },
      'emitBar'
    )

    const btnBaz = h(
      'button',
      {
        onClick: this.emitBarBaz
      },
      'emitBarBaz'
    )

    return h('div', {}, [btnBar, btnBaz])
  }
}
