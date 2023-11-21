<script setup lang="ts">
import { pull } from 'lodash'
import type { Tv } from '~/types'
import { getEpisodeKey } from '~/utils'

const props = defineProps<{
  tv: Tv | null
}>()

const {
  seasons,
  baseDir,
  filepathMappings,
  lockedKeys,
  lockedKeysSet,
} = useUnpackedTvDetail(() => props.tv)

const currentSeasonIdx = ref(0)
const currentEpisodeKeys = computed(() => seasons.value[currentSeasonIdx.value].episodes.map(e => getEpisodeKey(e)))
const currentUnlockedEpisodeKeys = computed(() => currentEpisodeKeys.value.filter(k => !lockedKeysSet.value.has(k)))

function handleCopy(paths: Array<string>) {
  for (let i = 0; i < Math.min(paths.length, currentUnlockedEpisodeKeys.value.length); i++) {
    const path = paths[i]
    const episodeKey = currentUnlockedEpisodeKeys.value[i]
    filepathMappings.value[episodeKey] = path
  }
}

fsSelectEmitter.on('copy', handleCopy)
</script>

<template>
  <div h-full>
    <div flex flex-none flex-justify-center>
      <div style="flex: 0 0;white-space:nowrap;display:flex;align-items:center;justify-content:center;">
        基础目录:
      </div>
      <n-input
        v-model:value="baseDir"
        size="small"
        type="text"
        clearable
        placeholder=""
      />
    </div>
    <n-tabs type="line" animated :default-value="0" @update:value="(v) => { currentSeasonIdx = v }">
      <n-tab-pane
        v-for="(s, idx) in seasons"
        :key="s.season_number"
        :name="idx"
        :tab="s.name"
        display-directive="show:lazy"
      >
        <div mb-48px flex px-12px>
          <!-- region 列 - 锁定 -->
          <div class="__col __col__[lock]" w-36px>
            <div class="__col__head">
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button
                    style="line-height: inherit;"
                    text
                    tag="a"
                    underline
                    @click="() => {
                      if (currentUnlockedEpisodeKeys.length === 0) {
                        pull(lockedKeys, ...currentEpisodeKeys)
                      }
                      else {
                        lockedKeys.push(...currentEpisodeKeys)
                      }
                    }"
                  >
                    锁定
                  </n-button>
                </template>
                {{ currentUnlockedEpisodeKeys.length === 0 ? '全部解锁' : '全部锁定' }}
              </n-tooltip>
            </div>
            <div
              v-for="e in s.episodes"
              :key="e.episode_number"
              class="__col__row"
              flex-justify-center
            >
              <n-switch
                :value="lockedKeysSet.has(getEpisodeKey(e))"
                size="small"
                @update:value="v => {
                  if (v) {
                    lockedKeys.push(getEpisodeKey(e))
                  }
                  else {
                    pull(lockedKeys, getEpisodeKey(e))
                  }
                }"
              />
            </div>
          </div>
          <!-- endregion 列 - 锁定 -->
          <!-- region 列 - ID -->
          <div class="__col __col__[id]" w-64px>
            <div class="__col__head">
              ID
            </div>
            <div
              v-for="e in s.episodes"
              :key="e.episode_number"
              class="__col__row"
              flex-justify-center
            >
              {{ getEpisodeKey(e) }}
            </div>
          </div>
          <!-- endregion 列 - ID -->
          <!-- region 列 - 标题 -->
          <div class="__col __col__[title]" w-120px>
            <div class="__col__head">
              标题
            </div>
            <div
              v-for="e in s.episodes"
              :key="e.episode_number"
              class="__col__row"
              flex-justify-start
            >
              <n-ellipsis :max-lines="1" w-full>
                {{ e.name }}
              </n-ellipsis>
            </div>
          </div>
          <!-- endregion 列 - 标题 -->
          <!-- region 列 - 文件路径 -->
          <div class="__col __col__[filepath]" important-flex-grow-1>
            <div class="__col__head">
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button
                    style="line-height: inherit;"
                    text
                    tag="a"
                    underline
                    @click="() => currentUnlockedEpisodeKeys.forEach(k => filepathMappings[k] = '')"
                  >
                    文件路径
                  </n-button>
                </template>
                全部清空
              </n-tooltip>
            </div>
            <div
              v-for="e in s.episodes"
              :key="e.episode_number"
              class="__col__row"
              flex-justify-start
            >
              <n-tooltip trigger="hover" :disabled="filepathMappings[getEpisodeKey(e)].length === 0">
                <template #trigger>
                  <n-input
                    v-model:value="filepathMappings[getEpisodeKey(e)]"
                    type="text"
                    size="tiny"
                    clearable
                    :disabled="lockedKeysSet.has(getEpisodeKey(e))"
                    placeholder="空路径将排除对应集数"
                  />
                </template>
                {{ filepathMappings[getEpisodeKey(e)] }}
              </n-tooltip>
            </div>
          </div>
          <!-- endregion 列 - 文件路径 -->
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style scoped>
/* region n-tab flex */
:deep(.n-tabs) {
  @apply h-full;
}

:deep(.n-tabs-nav) {
  @apply flex-none;
}

:deep(.n-tabs-pane-wrapper) {
  @apply h-full;
}

:deep(.n-tab-pane) {
  @apply h-full overflow-auto;
  --n-pane-padding-top: 0px;
  --n-pane-padding-bottom: 0px;
}

/* endregion n-tab flex */

.__col {
  @apply flex flex-col flex-none;
}

.__col__head {
  @apply flex flex-items-center flex-justify-center w-full h-32px min-h-32px;
}

.__col__row {
  @apply flex flex-items-center w-full h-24px min-h-24px;
}
</style>
