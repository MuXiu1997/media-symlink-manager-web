import { defineComponent, effect, stop } from 'vue'
import { useThemeVars } from 'naive-ui'
import styleTemplate from './template.css?inline'

const created = ref(false)

export default defineComponent({
  name: 'SplitPanesStyleAdapter',
  setup() {
    if (created.value) {
      console.warn('SplitPanesStyleAdapter should be used only once')
      return
    }

    const themeVars = useThemeVars()
    const styleEl = document.createElement('style')
    styleEl.setAttribute('type', 'text/css')
    styleEl.setAttribute('cssr-id', 'splitpanes-style-adapter')
    document.head.appendChild(styleEl)

    const runner = effect(() => {
      styleEl.textContent = styleTemplate
        .replace(/__border_color__/g, themeVars.value.dividerColor)
        .replace(/__background_color__/g, themeVars.value.bodyColor)
    })

    onUnmounted(() => {
      stop(runner)
      styleEl.remove()
      created.value = false
    })
  },
  render() {
    return null
  },
})
