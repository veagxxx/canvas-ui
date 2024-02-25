import { App, DirectiveBinding } from 'vue'
const merge = (el: HTMLElement, value: any, oldValue: any) => {
  if (value === undefined || value === null) {
    throw new Error('value must not be null or undefined')
  }
  if (oldValue !== value) {
    el.classList.remove(...formatClass(oldValue))
  }
  el.classList.add(...formatClass(value))
}
const vMergeClass = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value, oldValue } = binding
    merge(el, value, oldValue)
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    const { value, oldValue } = binding;
    merge(el, value, oldValue)
  }
}
const formatClass = (value: any, result: string[] = []) => {
  if (value && typeof value === 'object') {
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        formatClass(value[i], result)
      }
    } else {
      // 处理对象类型
      const keys: string[] = Object.keys(value)
      for (let j = 0; j < keys.length; j++) {
        if (!!value[keys[j]]) {
          result.push(keys[j])
        }
      }
    }
  } else {
    result.push(value)
  }
  return result
}
export const mergeClass = (app: App) => {
  app.directive('merge-class', vMergeClass)
}
