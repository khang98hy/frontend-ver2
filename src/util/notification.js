/* eslint-disable import/prefer-default-export */
import { notification } from 'antd'

export const showSuccessMessage = (message) => {
  notification.success({
    message: 'Thành công',
    description: message,
  })
}

export const showErrorMessage = (message) => {
  notification.error({
    message: 'Thất bại',
    description: message,
  })
}
