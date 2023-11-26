<script setup lang="ts">
import { darkTheme, dateZhCN, lightTheme, zhCN } from 'naive-ui'

import SplitPanesStyleAdapter from '~/components/SplitPanesStyleAdapter'

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
  <n-config-provider
    :theme="nTheme"
    :locale="zhCN"
    :date-locale="dateZhCN"
    abstract
  >
    <n-message-provider>
      <router-view v-slot="{ Component }">
        <transition>
          <keep-alive :include="['Home']">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
      <n-global-style />
      <SetupGlobal />
      <SplitPanesStyleAdapter />
    </n-message-provider>
  </n-config-provider>
</template>
