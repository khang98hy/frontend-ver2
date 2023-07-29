import ResetPassword from 'components/cleanui/system/Auth/ResetPassword'
import React from 'react'
import { Helmet } from 'react-helmet'

const SystemResetPassword = () => {
  return (
    <div>
      <Helmet title="Đặt lại mật khẩu" />
      <ResetPassword />
    </div>
  )
}

export default SystemResetPassword
