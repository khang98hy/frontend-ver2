import React from 'react'
import { Helmet } from 'react-helmet'
import ForgotPassword from 'components/cleanui/system/Auth/ForgotPassword'

const SystemForgotPassword = () => {
  return (
    <div>
      <Helmet title="Quên mật khẩu" />
      <ForgotPassword />
    </div>
  )
}

export default SystemForgotPassword
