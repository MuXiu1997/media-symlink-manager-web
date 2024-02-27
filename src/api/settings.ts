import { axiosInstance } from '~/api/request'

import type { AxiosResponse } from 'axios'
import type { Settings } from '~/types'

async function getSettings(): Promise<AxiosResponse<Settings>> {
  return axiosInstance.request({
    url: `/settings`,
    method: 'GET',
  })
}

export default {
  getSettings,
}
