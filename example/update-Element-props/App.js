import { h, ref } from '../../lib/mini-vue3.esm.js'

export const App = {
  name: 'App',
  setup() {
    const props = ref({
      foo: 'foo',
      bar: 'bar',
      baz: 'baz'
    })

    const onChangePropsDemo1 = () => {
      // 修改 props 对象中的 property
      props.value.foo = 'newFoo'
    }

    const onChangePropsDemo2 = () => {
      // 将 props 对象中的 property 赋值为 undefined 或 null
      props.value.bar = undefined
    }

    const onChangePropsDemo3 = () => {
      // 删除 props 对象中的 property
      const { baz, ...newProps } = props.value
      props.value = newProps
    }

    return {
      props,
      onChangePropsDemo1,
      onChangePropsDemo2,
      onChangePropsDemo3
    }
  },
  render() {
    return h(
      'div',
      {
        id: 'demo',
        ...this.props
      },
      [
        h(
          'button',
          {
            onClick: this.onChangePropsDemo1
          },
          'Demo1'
        ),
        h(
          'button',
          {
            onClick: this.onChangePropsDemo2
          },
          'Demo2'
        ),
        h(
          'button',
          {
            onClick: this.onChangePropsDemo3
          },
          'Demo3'
        )
      ]
    )
  }
}
