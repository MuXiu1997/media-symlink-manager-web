import defineUseDependencyInjection from '@muxiu1997/vue-easy-di'

import type { Settings } from '~/types'

export const useSettings = defineUseDependencyInjection<Ref<Settings>>({
  throwOnNoProvider: () => new Error('No provider found for `Settings`'),
})
