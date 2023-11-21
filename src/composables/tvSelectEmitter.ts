import mitt from 'mitt'

export const tvSelectEmitter = mitt<{
  addSuccess: number
}>()
