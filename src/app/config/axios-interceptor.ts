import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { Storage } from 'react-jhipster'

import { SERVER_API_URL } from './constants'

const TIMEOUT = 1 * 60 * 1000
axios.defaults.timeout = TIMEOUT
axios.defaults.baseURL = SERVER_API_URL

export const setupAxiosInterceptors = onUnauthenticated => {
  const onRequestSuccess = (config: InternalAxiosRequestConfig) => {
    const token = Storage.local.get('jhi-authenticationToken')
      || Storage.session.get('jhi-authenticationToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const onResponseSuccess = (response: AxiosResponse) => response
  const onResponseError = (err: { status: number; response: { status: number } }) => {
    const status = err.status || (err.response ? err.response.status : 0)
    if (status === 403 || status === 401) {
      onUnauthenticated()
    }
    return Promise.reject(err)
  }
  axios.interceptors.request.use(onRequestSuccess)
  axios.interceptors.response.use(onResponseSuccess, onResponseError)
}
