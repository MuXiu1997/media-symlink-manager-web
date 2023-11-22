<script setup lang="ts">
import type { ButtonProps } from 'naive-ui'
import type { TvListItem } from '~/types'
import tvApi from '~/api/tv'

defineOptions({
  name: 'Home',
})

const showTvSelect = ref(false)

const { loading, withLoading } = useLoading()
const tvList = ref<Array<TvListItem>>([])

async function listTv() {
  await withLoading(async () => {
    const res = await tvApi.listTv()
    tvList.value = res.data
  })
}

onMounted(() => {
  listTv()
})

const addedIds = computed(() => new Set(tvList.value.map(tv => tv.tmdb_id)))
tvSelectEmitter.on('addSuccess', listTv)

const router = useRouter()

function toTv(tmdbId: number) {
  router.push({
    name: 'Tv',
    params: {
      id: tmdbId.toString(),
    },
  })
}

const { loading: deleteLoading, withLoading: withDeleteLoading } = useLoading()
const message = useMessage()

async function handleDelete(tmdbId: number) {
  await withDeleteLoading(async () => {
    await tvApi.deleteTv(tmdbId)
    message.success('删除成功')
  })
  await listTv()
}
</script>

<template>
  <n-spin :show="loading">
    <div px-48px>
      <n-page-header subtitle="Media Symlink Manager">
        <template #extra>
          <n-space flex-items-center p-12px>
            <n-button type="primary" ghost @click="showTvSelect = true">
              添加 TV
            </n-button>
            <n-button text @click="toggleDark()">
              {{ isDark ? '浅色' : '深色' }}
            </n-button>
          </n-space>
        </template>
      </n-page-header>

      <n-list clickable bordered hoverable>
        <n-list-item v-for="tv in tvList" :key="tv.tmdb_id" @click="toTv(tv.tmdb_id)">
          <template #suffix>
            <n-popconfirm
              :negative-button-props="{ text: true } as ButtonProps"
              :positive-button-props="{ type: 'error', text: true, loading: deleteLoading } as ButtonProps"
              @positive-click="handleDelete(tv.tmdb_id)"
            >
              <template #trigger>
                <n-button type="error" text @click.stop>
                  删除
                </n-button>
              </template>
              确定删除
              <n-tag :bordered="false" size="small" mx-8px>
                {{ `${tv.name} (${tv.year})` }}
              </n-tag>
              吗？该操作不可恢复！
            </n-popconfirm>
          </template>
          {{ `${tv.name} (${tv.year})` }}
        </n-list-item>
      </n-list>
    </div>
    <tv-select v-model:show="showTvSelect" :added-ids="addedIds" />
  </n-spin>
</template>

<!-- language=yaml -->
<route lang="yaml">
name: Home
</route>
