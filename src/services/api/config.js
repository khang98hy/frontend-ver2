/* eslint-disable no-unused-vars */
import apiClient from 'services/axios'
import axios from 'axios'
import qs from 'qs'


const config = {
  get: (url, params) => {
    if (params) {
      return apiClient.get(url, {... params})
    }
    return apiClient.get(url)
  },
  post: (url, payload) => {
    return apiClient.post(url, payload)
  },
  put: (url, payload) => {
    return apiClient.put(url, payload)
  },
  patch: (url, payload) => {
    return apiClient.patch(url, payload)
  },
  delete: (url) => {
    return apiClient.delete(url)
  },
}
 

export default config
