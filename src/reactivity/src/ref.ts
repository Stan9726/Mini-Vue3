import { hasChanged } from '../../shared'
import { isTracking, trackEffects, triggerEffects } from './effect'
import { toReactive } from './reactive'

// ref 对象的接口
interface Ref {
	value
}

// Ref 接口的实现类，对操作进行封装
class RefImpl {
	// 用于保存传入的值和 set 的值
	private _rawValue
	private _value
	// 用于保存与当前 ref 对象相关的依赖
	private dep
  // 用于标志实例是一个 ref 对象
	public __v_isRef = true

	constructor(value) {
		// 将传入的值赋值给实例的私有 property _rawValue
		this._rawValue = value
		// 对传入的值进行处理，将结果赋值给实例的私有 property _value
		this._value = toReactive(value)
		this.dep = new Set()
	}

	// value property 的 get 返回私有 property _value 的值
	get value() {
		if (isTracking()) {
			// 收集依赖
			trackEffects(this.dep)
		}

		// 返回实例的私有 property _value 的值
		return this._value
	}

	// value property 的 set 修改私有 property _value 的值
	set value(newVal) {
		// 若 set 的值与之前不同则修改并触发依赖
		if (hasChanged(newVal, this._rawValue)) {
			// 将 set 的值赋值给实例的私有 property _rawValue
			this._rawValue = newVal
			// 对 set 的值进行处理，将结果赋值给实例的私有 property _value
			this._value = toReactive(newVal)
			// 触发依赖
			triggerEffects(this.dep)
		}
	}
}

export function ref(value): Ref {
	// 返回 RefImpl 类的实例，即 ref 对象
	return new RefImpl(value)
}

// 用于判断一个值是否是 ref 对象
export function isRef(value): boolean {
	return !!value.__v_isRef
}

// 用于获取 ref 对象的 value property 的值
export function unref(ref) {
	return isRef(ref) ? ref.value : ref
}
