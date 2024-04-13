<script setup lang="ts">
import { pull } from 'lodash'

import { useSettings } from '~/composables/settings'
import { getEpisodeKey } from '~/utils'

import type { Tv } from '~/types'

const props = defineProps<{
  tv: Tv | null
}>()

const settings = useSettings()

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

const fsSelectEmitter = useFsSelectEmitter()
fsSelectEmitter.autoOff('copy', handleCopy)

const regexpLeft = ref<Array<string>>([])
const regexpExpr = ref('')
const regexpObj = computed(() => {
  try {
    return new RegExp(regexpExpr.value)
  }
  catch (e) {
    return null
  }
})
const regexpReplace = ref('')
const regexpRight = computed(() => {
  return regexpLeft.value.map((l) => {
    const re = regexpObj.value
    if (re === null) return l
    return l.replace(re, regexpReplace.value)
  })
})
const regexpTableData = computed(() => {
  return regexpLeft.value.map((l, idx) => ({ left: l, right: regexpRight.value[idx] }))
})
function applyRegexpReplace() {
  currentEpisodeKeys.value.forEach((key, idx) => {
    filepathMappings.value[key] = regexpRight.value[idx]
  })
}
const isShowRegexpModal = ref(false)
function showRegexpModal() {
  isShowRegexpModal.value = true
  regexpLeft.value = currentUnlockedEpisodeKeys.value.map(k => filepathMappings.value[k])
}
</script>

<template>
  <div h-full>
    <div
      flex
      flex-none
      flex-justify-center
    >
      <div
        style="flex: 0 0;white-space:nowrap;display:flex;align-items:center;justify-content:center;"
        mr-8px
      >
        基础目录:
      </div>
      <n-auto-complete
        v-model:value="baseDir"
        :options="settings.target_base_dir_options"
        size="small"
        clearable
        placeholder=""
        :get-show="() => true"
      />
    </div>
    <n-tabs
      type="line"
      animated
      :default-value="0"
      @update:value="(v) => { currentSeasonIdx = v }"
    >
      <n-tab-pane
        v-for="(s, idx) in seasons"
        :key="s.season_number"
        :name="idx"
        :tab="s.name"
        display-directive="show:lazy"
      >
        <div
          mb-48px
          flex
          px-12px
        >
          <!-- region 列 - 锁定 -->
          <div
            class="__col __col__[lock]"
            w-36px
          >
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
          <div
            class="__col __col__[id]"
            w-64px
          >
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
          <div
            class="__col __col__[title]"
            w-120px
          >
            <div class="__col__head">
              标题
            </div>
            <div
              v-for="e in s.episodes"
              :key="e.episode_number"
              class="__col__row"
              flex-justify-start
            >
              <n-ellipsis
                :max-lines="1"
                w-full
              >
                {{ e.name }}
              </n-ellipsis>
            </div>
          </div>
          <!-- endregion 列 - 标题 -->
          <!-- region 列 - 文件路径 -->
          <div
            class="__col __col__[filepath]"
            important-flex-grow-1
          >
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
              <n-button
                style="line-height: inherit;"
                tag="a"
                text
                ml-8px
                underline
                @click="showRegexpModal"
              >
                [ 正则批量修改 ]
              </n-button>
            </div>
            <div
              v-for="e in s.episodes"
              :key="e.episode_number"
              class="__col__row"
              flex-justify-start
            >
              <n-tooltip
                trigger="hover"
                :disabled="filepathMappings[getEpisodeKey(e)].length === 0"
              >
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
    <n-modal
      v-model:show="isShowRegexpModal"
      preset="dialog"
      :icon="() => ''"
      title="正则批量修改"
      style="width: 80vw"
    >
      <div>
        <div
          flex
          flex-none
          flex-justify-center
        >
          <div
            style="flex: 0 0;white-space:nowrap;display:flex;align-items:center;justify-content:center;"
            mr-8px
          >
            正则:
          </div>
          <n-input v-model:value="regexpExpr" />
        </div>
        <div
          mt-8px
          flex
          flex-none
          flex-justify-center
        >
          <div
            style="flex: 0 0;white-space:nowrap;display:flex;align-items:center;justify-content:center;"
            mr-8px
          >
            替换:
          </div>
          <n-input v-model:value="regexpReplace" />
        </div>
        <div mt-8px>
          <n-button
            type="primary"
            ghost
            @click="applyRegexpReplace"
          >
            批量替换
          </n-button>
        </div>
        <n-data-table
          mt-20px
          :columns="[{ title: '当前路径', key: 'left' }, { title: '替换结果', key: 'right' }]"
          :data="regexpTableData"
          :single-line="false"
        />
      </div>
    </n-modal>
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
