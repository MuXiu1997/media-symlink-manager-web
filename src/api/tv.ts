import type { AxiosResponse } from 'axios'
import { axiosInstance } from '~/api/request'
import type { TmdbTv, Tv, TvListItem } from '~/types'

async function searchTv(query: string): Promise<AxiosResponse<Array<TmdbTv>>> {
  return axiosInstance.request({
    url: '/tv:search-tmdb',
    method: 'GET',
    params: {
      query,
    },
  })
}

async function addTv(tmdbId: number): Promise<AxiosResponse<void>> {
  return axiosInstance.request({
    url: `/tv/${tmdbId}`,
    method: 'PUT',
  })
}

async function listTv(): Promise<AxiosResponse<Array<TvListItem>>> {
  return axiosInstance.request({
    url: '/tv',
    method: 'GET',
  })
}

async function getTv(tmdbId: number): Promise<AxiosResponse<Tv>> {
  return axiosInstance.request({
    url: `/tv/${tmdbId}`,
    method: 'GET',
  })
}

async function updateTvFilepathMapping(tmdbId: number, filepath_mapping: Tv['filepath_mapping']): Promise<AxiosResponse<void>> {
  return axiosInstance.request({
    url: `/tv/${tmdbId}/filepath-mapping`,
    method: 'PUT',
    data: filepath_mapping,
  })
}

async function deleteTv(tmdbId: number): Promise<AxiosResponse<void>> {
  return axiosInstance.request({
    url: `/tv/${tmdbId}`,
    method: 'DELETE',
  })
}

async function apply(tmdbId: number): Promise<AxiosResponse<void>> {
  return axiosInstance.request({
    url: `/tv/${tmdbId}:apply`,
    method: 'POST',
  })
}

export default {
  searchTv,
  addTv,
  listTv,
  getTv,
  updateTvFilepathMapping,
  deleteTv,
  apply,
}
