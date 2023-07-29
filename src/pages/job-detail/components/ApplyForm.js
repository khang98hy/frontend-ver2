/* eslint-disable no-unused-vars */
import { Form, Input, Modal, Select } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { useForm } from 'antd/lib/form/Form'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ApplicationJobAPI from 'services/api/applicationJob.api'
import CvAPI from 'services/api/cv.api'
import { showErrorMessage, showSuccessMessage } from 'util/notification'

const ApplyForm = (props) => {
  const { open, setOpen, jobId } = props
  const { authorized, jobSeekerId } = useSelector((state) => state.user)
  const [cvList, setCvList] = useState([])
  const [form] = useForm()
  const handleCancel = () => {
    form.resetFields()
    setOpen(false)
  }
  const fetchCv = async (payload) => {
    const response = await CvAPI.search(payload)
    if (response) {
      setCvList(response.data.content)
    }
  }
  useEffect(() => {
    if (authorized) {
      const payload = {
        page: 0,
        size: 1000,
        'jobSeekerId.equals': jobSeekerId,
        sort: 'lastModifiedDate,desc',
      }
      fetchCv(payload)
    }
  }, [authorized, jobSeekerId])

  const handleOk = async () => {
    const values = await form.validateFields()
    const payload = {
      ...values,
      jobId,
    }
    try {
      const response = await ApplicationJobAPI.create(payload)
      if (response) {
        showSuccessMessage('Đã gửi yêu cầu ứng tuyển')
        handleCancel()
      }
    } catch (error) {
      showErrorMessage('Ứng tuyển thất bại')
    }
  }
  return (
    <Modal open={open} onCancel={handleCancel} onOk={handleOk}>
      <Form form={form} name="apply-form" layout="vertical">
        <FormItem label="Giới thiệu" name="introduction">
          <Input.TextArea showCount maxLength={500} autoSize={{ minRows: 5, maxRows: 8 }} />
        </FormItem>
        <FormItem
          label="CV"
          name="cvId"
          rules={[{ required: true, message: 'CV không được để trống' }]}
        >
          <Select
            placeholder="Chọn CV"
            options={cvList?.map((item) => {
              return {
                value: item.id,
                label: item.name,
              }
            })}
          />
        </FormItem>
      </Form>
    </Modal>
  )
}
export default ApplyForm
