/* eslint-disable no-unused-vars */
import { Button, Card, Col, Form, Input, Row } from 'antd'
import PersonalMenu from 'components/personal/PersonalMenu'
import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

const mapStateToProps = ({ user, dispatch }) => ({
  dispatch,
  user,
})
const PersonalInformation = (props) => {
  const { user, dispatch } = props
  const onFinish = (values) => {
    dispatch({
      type: 'user/CHANGE_PASSWORD',
      payload: values,
    })
  }
  return (
    <div>
      <Helmet title="Thông tin cá nhân" />
      <Row gutter={16} style={{ width: '80%', margin: 'auto' }}>
        <Col span={5}>
          <PersonalMenu />
        </Col>
        <Col span={19}>
          <Card title={<h3 style={{ fontWeight: 'bold' }}>THÔNG TIN CÁ NHÂN</h3>}>
            <Form
              name="personal-information"
              layout="vertical"
              labelCol={{
                offset: 4,
                span: 4,
              }}
              wrapperCol={{
                offset: 4,
                span: 16,
              }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item label="Email" name="email">
                <Input readOnly defaultValue={user.email} />
              </Form.Item>

              <Form.Item label="Username" name="username">
                <Input readOnly defaultValue={user.username} />
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default connect(mapStateToProps)(PersonalInformation)
