/* eslint-disable no-unused-vars */
import { DatePicker, Form, Input, Modal, Radio } from 'antd'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FormItem from 'antd/es/form/FormItem'
import { useForm } from 'antd/lib/form/Form'
import ApplicationJobAPI from 'services/api/applicationJob.api'
import { showErrorMessage, showSuccessMessage } from 'util/notification'
import moment from 'moment'
import recruitmentActions from '../reducers/actions'

const AcceptForm = () => {
  const dispatch = useDispatch()
  const { openAcceptForm, selectedApplicationJob } = useSelector((state) => state.recruitment)
  const [form] = useForm()
  const [interviewType, setInterviewType] = useState('offline')
  const handleCancel = () => {
    dispatch({
      type: recruitmentActions.SET_STATE,
      payload: {
        openAcceptForm: false,
        selectedApplicationJob: null,
        reloadCandidate: Math.random(),
      },
    })
  }
  const handleOk = async () => {
    const values = await form.validateFields()
    const payload = {
      interviewTime: moment(values.interviewTime).toISOString(),
      address: values?.address
    }
    try {
      const response = await ApplicationJobAPI.accept(selectedApplicationJob.id, payload)
      if (response) {
        showSuccessMessage('Đã gửi thông báo phỏng vấn thành công')
        handleCancel()
      }
    } catch (error) {
      showErrorMessage('Gửi thông báo phỏng vấn thất bại')
    }
  }
  return (
    <Modal
      title="Gửi thông báo phỏng vấn"
      open={openAcceptForm}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Gửi thông báo"
    >
      <Radio.Group
        value={interviewType}
        onChange={(e) => {
          setInterviewType(e.target.value)
        }}
      >
        <Radio value="offline">Phỏng vấn trực tiếp</Radio>
        <Radio value="online">Phỏng vấn online</Radio>
      </Radio.Group>
      <Form form={form}>
        <FormItem
          label="Thời gian phỏng vấn"
          name="interviewTime"
          rules={[{ required: true, message: 'Thời gian phỏng vấn không được để trống' }]}
        >
          <DatePicker showTime={{ format: 'HH:mm' }} />
        </FormItem>
        {interviewType === 'offline' && (
          <FormItem
            label="Địa điểm"
            name="address"
            rules={[{ required: true, message: 'Địa điểm không được để trống' }]}
          >
            <Input />
          </FormItem>
        )}
      </Form>
    </Modal>
  )
}

export default AcceptForm
