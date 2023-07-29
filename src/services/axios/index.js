/* eslint-disable no-unused-vars */
import { notification } from 'antd'
import axios from 'axios'
import { LOGOUT } from 'redux/user/sagas'
import store from 'store'
import { showErrorMessage } from 'util/notification'
import { logout } from '../jwt'

const BASE_URL = '/api'

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
})

apiClient.interceptors.request.use((request) => {
  const accessToken = store.get('accessToken')
  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`
    request.headers.AccessToken = accessToken
  }
  return request
})

apiClient.interceptors.response.use(undefined, (error) => {
  // Errors handling
  const { response } = error
  const { data } = response
  if (data) {
    if (data.status === 403) {
      notification.error({
        message: 'Lỗi',
        description: 'Bạn không đủ quyền thực hiện',
      })

      LOGOUT()
    } else if (data.status >= 500) {
      notification.error({
        message: 'Hệ thống đang bận, vui lòng thử lại sau',
      })
    } else if (data.status === 401) {
      notification.error({
        message: 'Lỗi',
        description: 'Đã có lỗi xảy ra, hãy đăng nhập lại',
      })
      LOGOUT()
    } else if(data.status === 400){
      showErrorMessage(data?.title)
    }
  }
})

export default apiClient
