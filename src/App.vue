<script setup lang="ts">
import { darkTheme, dateZhCN, lightTheme, zhCN } from 'naive-ui'

isDark.value = true
const nTheme = computed(() => isDark.value ? darkTheme : lightTheme)

const SetupGlobal = defineComponent({
  setup() {
    window.$message = useMessage()
  },
  render() {
    return null
  },
})
</script>

<template>
  <n-config-provider :theme="nTheme" :locale="zhCN" :date-locale="dateZhCN" abstract>
    <n-message-provider>
      <RouterView />
      <n-global-style />
      <SetupGlobal />
    </n-message-provider>
  </n-config-provider>
</template>
