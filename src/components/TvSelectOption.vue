<script setup lang="ts">
import type { TmdbTv } from '~/types'
import tvApi from '~/api/tv'

const props = defineProps<{
  tv: TmdbTv
  added: boolean
}>()

function formatDate(date: string) {
  const [year, month, day] = date.split('-')
  return `${year} 年 ${month} 月 ${day} 日`
}

const posterW188H282BaseUrl = 'https://www.themoviedb.org/t/p/w188_and_h282_face'
const { loading, withLoading } = useLoading()

const message = useMessage()
const tvSelectEmitter = useTvSelectEmitter()
async function handleAdd() {
  await withLoading(async () => {
    await tvApi.addTv(props.tv.id)
    tvSelectEmitter.emit('addSuccess', props.tv.id)
    message.success('添加成功')
  })
}
</script>

<template>
  <div flex>
    <n-image
      object-fit="contain"
      :src="`${posterW188H282BaseUrl}${tv.poster_path}`"
      style="flex-basis: 94px"
      w-94px flex-none
    />
    <div min-w-0 flex-shrink-0 flex-grow-1 flex-basis-0 px-15px py-10px>
      <h2 text-size-1.2em>
        {{ tv.name }}
      </h2>
      <div>
        {{ formatDate(tv.first_air_date) }}
      </div>
      <div mt-20px box-border h-auto w-full>
        <p class="tv-overview">
          {{ tv.overview }}
        </p>
      </div>
    </div>
    <div w-80px flex flex-justify-end flex-items-center>
      <n-button type="primary" ghost :disabled="added" :loading="loading" @click="handleAdd">
        {{ added ? '已添加' : '添加' }}
      </n-button>
    </div>
  </div>
</template>

<style>
.tv-overview {
  white-space: break-spaces;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
