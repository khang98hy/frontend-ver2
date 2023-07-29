/* eslint-disable no-unused-vars */
import { Button, Col, Form, Input, Row } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React, { useState } from 'react'
import UserAPI from 'services/api/user.api'
import { showErrorMessage, showSuccessMessage } from 'util/notification'

const EmployerRegisterForm = () => {
  const [loading, setLoading] = useState(false)
  const [form] = useForm()

  const handleRegister = () => {
    form.validateFields().then(async (values) => {
      setLoading(true)
      try {
        const response = await UserAPI.registerEmployer(values)
        if (response) {
          showSuccessMessage('Đăng ký tài khoản thành công')
        }
        setLoading(false)

      } catch (error) {
        showErrorMessage('Đăng ký tài khoản thất bại')
        setLoading(false)
      }
    })
  }
  return (
    <>
      <Form form={form} name="job-seeker-register-form" layout="vertical" scrollToFirstError>
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="fullname"
              label="Họ và tên"
              rules={[{ required: true, message: 'Họ và tên không được để trống' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[{ required: true, message: 'Tên đăng nhập không được để trống' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Email không được để trống' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Mật khẩu không được để trống' }]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="companyName"
              label="Tên công ty"
              rules={[{ required: true, message: 'Tên công ty không được để trống' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="confirmPassword"
              label="Nhập lại mật khẩu"
              rules={[{ required: true, message: 'Nhập lại mật khẩu không được để trống' }]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="phoneNumber"
              label="Số điện thoại cá nhân"
              rules={[{ required: true, message: 'Số điện thoại cá nhân không được để trống' }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="taxCode"
              label="Mã số thuế công ty"
              rules={[{ required: true, message: 'Mã số thuế công ty không được để trống' }]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Button
        type="primary"
        size="large"
        className="text-center w-100"
        onClick={handleRegister}
        loading={loading}
      >
        <strong>Đăng ký</strong>
      </Button>
    </>
  )
}

export default EmployerRegisterForm
