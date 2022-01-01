import { h, provide, inject } from '../../lib/mini-vue3.esm.js'

// 第一级组件
const Provider_I = {
  name: 'Provider_I',
  setup() {
    // 通过 provide 注入 foo 和 bar
    provide('foo', 'FooFromI')
    provide('bar', 'BarFromI')
  },
  render() {
    return h('div', {}, [h('p', {}, 'Provider_I'), h(Provider_II)])
  }
}

// 第二级组件
const Provider_II = {
  name: 'Provider_II',
  setup() {
    // 通过 provide 注入 foo
    provide('foo', 'FooFromII')
  },
  render() {
    return h('div', {}, [h('p', {}, 'Provider_II'), h(Consumer)])
  }
}

// 第三级组件
const Consumer = {
  name: 'Consumer',
  setup() {
    // 通过 inject 引入 foo 和 bar
    const foo = inject('foo') // => FooFromII
    const bar = inject('bar') // => BarFromI

    // 通过 inject 引入 baz，同时传入默认值或默认值函数
    const baz1 = inject('baz', 'defaultBaz1') // => defaultBaz1
    const baz2 = inject('baz', () => 'defaultBaz2') // => defaultBaz2

    return {
      foo,
      bar,
      baz1,
      baz2
    }
  },
  render() {
    return h('div', {}, [
      h(
        'p',
        {},
        `Consumer: inject ${this.foo}, ${this.bar}, ${this.baz1}, and ${this.baz2}`
      )
    ])
  }
}

export default {
  name: 'App',
  setup() {},
  render() {
    return h('div', {}, [h('p', {}, 'provide-inject'), h(Provider_I)])
  }
}
