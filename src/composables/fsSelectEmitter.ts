import mitt from 'mitt'

export const fsSelectEmitter = mitt<{
  copy: Array<string>
}>()
