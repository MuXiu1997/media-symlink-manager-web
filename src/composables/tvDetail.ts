import type { MaybeRefOrGetter } from '@vueuse/core'
import { isNil } from 'lodash'
import type { TmdbSeason, Tv } from '~/types'
import tvApi from '~/api/tv'

export function useTvDetail(seriesId: MaybeRefOrGetter<number>) {
  const { loading, withLoading } = useLoading()
  const tv = ref<Tv | null>(null)

  async function getTv() {
    await withLoading(async () => {
      const res = await tvApi.getTv(toValue(seriesId))
      tv.value = res.data
    })
  }

  return {
    loading,
    tv,
    getTv,
  } as const
}

export function useUnpackedTvDetail(tv: MaybeRefOrGetter<Tv | null>) {
  const seasons = computed((): Array<TmdbSeason> => {
    const $tv = toValue(tv)
    if (isNil($tv))
      return []

    return $tv.tmdb_seasons
  })

  const baseDir = computed({
    get: (): string => {
      const $tv = toValue(tv)
      if (isNil($tv))
        return ''

      return $tv.filepath_mapping.base_dir
    },
    set: (val: string) => {
      const $tv = toValue(tv)
      if (isNil($tv))
        return

      $tv.filepath_mapping.base_dir = val
    },
  })

  const filepathMappings = computed((): Record<string, string> => {
    const $tv = toValue(tv)
    if (isNil($tv))
      return {}

    return $tv.filepath_mapping.mappings
  })

  const lockedKeys = computed((): Array<string> => {
    const $tv = toValue(tv)
    if (isNil($tv))
      return []

    return $tv.filepath_mapping.locked_keys
  })

  const lockedKeysSet = computed((): Set<string> => new Set(lockedKeys.value))

  return {
    seasons,
    baseDir,
    filepathMappings,
    lockedKeys,
    lockedKeysSet,
  } as const
}
