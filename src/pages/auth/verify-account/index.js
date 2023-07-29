/* eslint-disable no-unused-vars */
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Button, Col, Image, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { history } from 'index'
import { useLocation } from 'react-router-dom'
import UserAPI from 'services/api/user.api'

const SystemVerifyAccount = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const key = queryParams.get('key')
  const [loading, setLoading] = useState(false)
  const [activated, setActivated] = useState()
  // eslint-disable-next-line no-shadow
  const handleActivateAccount = async (key) => {
    setLoading(true)
    const response = await UserAPI.activateAccount({ key })
    if (response && response.status === 200) {
      setActivated(true)
    } else {
      setActivated(false)
    }
    setLoading(false)
  }
  useEffect(() => {
    if (key) {
      handleActivateAccount(key)
    } else {
      setActivated(false)
    }
  }, [key])
  return (
    <>
      <div style={{ width: '100%', paddingTop: '30%' }}>
        <Helmet title="Xác nhận tài khoản" />
        <Row style={{ width: '100%' }} justify="space-around" align="middle">
          {activated && (
            <>
              <CheckCircleOutlined style={{ fontSize: 100, color: '#41b883' }} />
              <span style={{ fontSize: 40 }}>Xác nhận tài khoản thành công</span>
            </>
          )}
          {!activated && (
            <>
              <CloseCircleOutlined style={{ fontSize: 100, color: 'red' }} />
              <span style={{ fontSize: 40 }}>Xác nhận tài khoản thất bại</span>
            </>
          )}
        </Row>
        <Row style={{ width: '100%' }} justify="space-around" align="middle">
          {' '}
          <Button
            type="primary"
            shape="round"
            size="large"
            style={{ textAlign: 'center', margin: 'auto' }}
            onClick={() => {
              history.push('/auth/login')
            }}
          >
            Đăng nhập
          </Button>
        </Row>
      </div>
    </>
  )
}

export default SystemVerifyAccount
