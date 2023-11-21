import type { AxiosResponse } from 'axios'
import { axiosInstance } from '~/api/request'
import type { FSItem } from '~/types'

async function ls(absPath: string): Promise<AxiosResponse<Array<FSItem>>> {
  return axiosInstance.request({
    url: '/fs:ls',
    method: 'GET',
    params: {
      abs_path: absPath,
    },
  })
}

export default {
  ls,
}
