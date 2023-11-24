import defineEmitterComposable from '@muxiu1997/vue-use-emitter'

export const useFsSelectEmitter = defineEmitterComposable<{ copy: Array<string> }>({
  key: Symbol('fsSelectEmitter'),
  throwOnNoProvider: () => new Error('No provider found for fsSelectEmitter'),
})
