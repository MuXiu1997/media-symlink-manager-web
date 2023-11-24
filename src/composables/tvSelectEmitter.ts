import defineEmitterComposable from '@muxiu1997/vue-use-emitter'

export const useTvSelectEmitter = defineEmitterComposable<{ addSuccess: number }>({
  key: Symbol('tvSelectEmitter'),
  throwOnNoProvider: () => new Error('No provider found for tvSelectEmitter'),
})
