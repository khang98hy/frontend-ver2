/* eslint-disable no-unused-vars */
import { Form, Input, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React, { useState, useEffect } from 'react'

import JobCategoryAPI from 'services/api/jobCategory.api'
import { showErrorMessage, showSuccessMessage } from 'util/notification'

const JobCategoryForm = (props) => {
  const { open, setOpen, initialJobCategory, setReloadData, setInitialJobCategory } = props
  const [loading, setLoading] = useState(false)
  const [form] = useForm()
  const handleCancel = () => {
    setOpen(false)
    setReloadData(Math.random())
    setInitialJobCategory()
    form.resetFields()
  }
  useEffect(() => {
    form.setFieldsValue(initialJobCategory)
  }, [form, initialJobCategory])
  const handleCreate = async (values) => {
    setLoading(true)
    const response = await JobCategoryAPI.create(values)
    if (response) {
      showSuccessMessage('Thêm ngành ngành nghề thành công')
      handleCancel()
    } else {
      showErrorMessage('Thêm ngành nghề thất bại')
    }
    setLoading(false)
  }
  const handleUpdate = async (id, values) => {
    setLoading(true)
    const response = await JobCategoryAPI.update(id, values)
    if (response) {
      showSuccessMessage('Cập nhật thông tin ngành nghề thành công')
      handleCancel()
    } else {
      showErrorMessage('Cập nhật thông tin ngành nghề thất bại')
    }
    setLoading(false)
  }

  return (
    <Modal
      title={initialJobCategory?.id ? 'Chỉnh sửa ngành nghề' : 'Thêm mới ngành nghề'}
      open={open}
      onCancel={handleCancel}
      confirmLoading={loading}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            if (initialJobCategory?.id) {
              handleUpdate(initialJobCategory?.id, values)
            } else {
              handleCreate(values)
            }
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="job_category_form"
        initialValues={initialJobCategory}
      >
        <Form.Item
          name="name"
          label="Tên ngành nghề"
          rules={[
            {
              required: true,
              message: 'Tên ngành nghề không được để trống',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default JobCategoryForm
