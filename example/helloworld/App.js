import { h } from '../../lib/mini-vue3.esm.js'

// 根组件选项对象
export const App = {
	// render 函数
	render() {
		// 在 render 函数中能够获取 setup 返回对象的属性
		// return h('div', 'hello, ' + this.msg)
		return h('div', { id: 'root', class: 'root' }, [
			h('p', { id: 'p1', class: 'p1' }, 'hello, mini-vue3'),
			h('p', { id: 'p2', class: 'p2' }, 'this is mini-vue3')
		])
	},
	// composition API
	setup() {
		// 返回一个对象
		return {
			name: 'mini-vue3'
		}
	}
}
