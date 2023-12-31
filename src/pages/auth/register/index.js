import React from 'react'
import { Helmet } from 'react-helmet'
import Register from 'components/cleanui/system/Auth/Register'

const SystemRegister = () => {
  return (
    <div>
      <Helmet title="Đăng ký" />
      <Register />
    </div>
  )
}

export default SystemRegister
