<script setup lang="ts">
import { darkTheme, dateZhCN, lightTheme, zhCN } from 'naive-ui'

import settingsApi from '~/api/settings'
import SplitPanesStyleAdapter from '~/components/SplitPanesStyleAdapter'
import { useSettings } from '~/composables/settings'

import type { Settings } from '~/types'

const nTheme = computed(() => isDark.value ? darkTheme : lightTheme)

const SetupGlobal = defineComponent({
  setup() {
    window.$message = useMessage()
  },
  render() {
    return null
  },
})

const settings = ref<Settings>({
  target_base_dir_options: [],
  fs_select_base_dir: '/',
})
useSettings('provide', () => settings)

onBeforeMount(async () => {
  const res = await settingsApi.getSettings()
  settings.value = res.data
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
