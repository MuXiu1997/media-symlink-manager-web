<script setup lang="ts">
import tvApi from '~/api/tv'

import type { TmdbTv } from '~/types'

const props = withDefaults(
  defineProps<{
    show?: boolean
    addedIds?: Set<number>
  }>(),
  {
    show: false,
    addedIds: () => new Set<number>(),
  },
)

const emit = defineEmits<{
  (e: 'update:show', v: boolean): void
}>()

const { show: $show } = useVModels(props, emit)
const results = ref<Array<TmdbTv>>([])

const query = ref('')
const { loading, withLoading } = useLoading()

async function handleSearch() {
  await withLoading(async () => {
    if (query.value === '') {
      results.value = []
      await new Promise(resolve => setTimeout(resolve, 200))
      return
    }

    const res = await tvApi.searchTv(query.value)
    results.value = res.data
  })
}
</script>

<template>
  <div>
    <n-modal
      :show="$show"
      @mask-click="$show = false"
    >
      <n-card
        title="添加 TV"
        size="huge"
        :bordered="false"
        role="dialog"
        aria-modal="true"
        closable
        w-600px
        @close="$show = false"
      >
        <n-input-group>
          <n-input
            v-model:value="query"
            type="text"
            placeholder="搜索 TV"
            clearable
            @keyup="(e) => { if (e.key === 'Enter') handleSearch() }"
          />
          <n-button
            type="primary"
            :loading="loading"
            :disabled="query === ''"
            ghost
            ml-8px
            @click="handleSearch"
          >
            搜索
          </n-button>
        </n-input-group>
        <div>
          <n-empty
            v-if="results.length === 0"
            size="huge"
            description="暂无数据"
            mt-20px
          />
          <tv-select-option
            v-for="tv in results"
            :key="tv.id"
            :tv="tv"
            :added="addedIds.has(tv.id)"
          />
        </div>
      </n-card>
    </n-modal>
  </div>
</template>
