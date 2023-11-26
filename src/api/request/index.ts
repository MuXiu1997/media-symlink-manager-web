import axios, { AxiosError, isAxiosError } from 'axios'
import { isNil } from 'lodash'

export const axiosInstance = axios.create({
  ...axios.defaults,
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

axiosInstance.interceptors.response.use(
  null,
  (error) => {
    console.error(error)
    if (!(isAxiosError(error))) {
      window.$message.error('未知错误')
      return Promise.reject(error)
    }

    if (error.code === AxiosError.ETIMEDOUT) {
      window.$message.error('请求超时，请稍后再试')
      return Promise.reject(error)
    }

    if (error.code === AxiosError.ERR_NETWORK) {
      if (!navigator.onLine) window.$message.error('网络错误，请检查网络连接')
      else window.$message.error('服务器未响应，请稍后再试')
      return Promise.reject(error)
    }

    if (isNil(error.response)) {
      window.$message.error('服务器未响应，请稍后再试')
      return Promise.reject(error)
    }

    if (error.response.status >= 500) {
      window.$message.error('服务器错误，请稍后再试')
      return Promise.reject(error)
    }

    const errMsg = error.response.headers['x-error']
    if (errMsg) {
      window.$message.error(errMsg)
      return Promise.reject(error)
    }

    return Promise.reject(error)
  },
)
