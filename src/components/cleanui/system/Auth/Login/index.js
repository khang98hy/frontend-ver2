/* eslint-disable no-unused-vars */
import React from 'react'
import { connect } from 'react-redux'
import { Input, Button, Radio, Form, Tooltip, Image, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import style from '../style.module.scss'

const mapStateToProps = ({ user, settings, dispatch }) => ({
  dispatch,
  user,
  authProvider: settings.authProvider,
  logo: settings.logo,
})

const Login = ({ dispatch, user, authProvider, logo }) => {
  const onFinish = (values) => {
    dispatch({
      type: 'user/LOGIN',
      payload: values,
    })
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const changeAuthProvider = (value) => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'authProvider',
        value,
      },
    })
  }

  return (
    <div>
      <div className="text-center mb-5">
        <Link to="/public/jobs">
          <Image
            src={`${process.env.PUBLIC_URL}/resources/images/logo-jobpica.png`}
            preview={false}
          />
        </Link>
        <h1 className="mb-5 px-3">
          <strong>Chào mừng bạn trở lại</strong>
        </h1>
      </div>
      <div className={`card ${style.container}`}>
        <Form
          layout="vertical"
          requiredMark
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="mb-4"
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng tên đăng nhập' }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Button
            type="primary"
            size="large"
            className="text-center w-100"
            htmlType="submit"
            loading={user.loading}
          >
            <strong>Đăng nhập</strong>
          </Button>
        </Form>
        <Row justify="end">
          <Col>
            <Link to="/auth/forgot-password" className="kit__utils__link font-size-16">
              Quên mật khẩu?
            </Link>
          </Col>
        </Row>
      </div>
      <div className="text-center pt-2 mb-auto">
        <span className="mr-2">Bạn chưa có tài khoản?</span>
        <Link to="/auth/register" className="kit__utils__link font-size-16">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(Login)
