<script setup lang="ts">
import { isNil } from 'lodash'
import { Pane, Splitpanes } from 'splitpanes'

import 'splitpanes/dist/splitpanes.css'
import tvApi from '~/api/tv'
import TvToFsMapper from '~/components/TvToFsMapper.vue'

defineOptions({
  name: 'Tv',
})

const route = useRoute()

const {
  loading,
  tv,
  getTv,
} = useTvDetail(() => +(route.params.id as string))
onMounted(() => getTv())

const { loading: saveLoading, withLoading: withSaveLoading } = useLoading()

const message = useMessage()
async function handleSave() {
  await withSaveLoading(async () => {
    await tvApi.updateTvFilepathMapping(
      tv.value!.tmdb_id,
      tv.value!.filepath_mapping,
    )
    message.success('保存成功')
  })
}

const { loading: applyLoading, withLoading: withApplyLoading } = useLoading()

async function handleApply() {
  await withApplyLoading(async () => {
    await tvApi.apply(tv.value!.tmdb_id)
    message.success('应用成功')
  })
}

useFsSelectEmitter('provide')
</script>

<template>
  <n-spin :show="loading || isNil(tv)">
    <n-page-header
      h-100vh
      flex
      flex-col
      @back="$router.back()"
    >
      <template #title>
        {{ isNil(tv) ? 'Loading...' : `${tv.name} (${tv.year})` }}
      </template>
      <template #extra>
        <n-space
          size="small"
          p-4px
        >
          <n-button
            size="small"
            ghost
            :loading="saveLoading"
            @click="handleSave"
          >
            保存
          </n-button>
          <n-button
            size="small"
            type="success"
            ghost
            :loading="applyLoading"
            @click="handleApply"
          >
            应用
          </n-button>
        </n-space>
      </template>
      <Splitpanes
        class="default-theme"
        :dbl-click-splitter="false"
        h-full
      >
        <Pane
          size="60"
          style="display:flex;flex-direction:column;overflow:hidden;"
        >
          <TvToFsMapper :tv="tv" />
        </Pane>
        <Pane>
          <fs-select />
        </Pane>
      </Splitpanes>
    </n-page-header>
  </n-spin>
</template>

<style scoped>
:deep(.splitpanes__pane) {
  overflow: auto;
}

/* region n-page flex */
:deep(.n-page-header) {
  @apply flex-none;
}

:deep(.n-page-header-content) {
  @apply h-full overflow-hidden px-12px;
}

/* endregion n-page flex */
</style>

<!-- language=yaml -->
<route lang="yaml">
name: Tv
</route>
