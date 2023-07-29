/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Button, Form, Input, Modal, Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FormItem from 'antd/es/form/FormItem'
import { UploadOutlined } from '@ant-design/icons'
import { useForm } from 'antd/lib/form/Form'
import { showErrorMessage, showSuccessMessage } from 'util/notification'
import store from 'store'
import axios from 'axios'
import { getCV } from 'util/helper'
import cvActions from '../reducers/actions'

const CvForm = () => {
  const dispatch = useDispatch()
  const { openForm, selectedCv } = useSelector((state) => state.cv)
  const [form] = useForm()
  const token = store.get('accessToken')
  const handleCancel = () => {
    form.resetFields()
    dispatch({
      type: cvActions.SET_STATE,
      payload: {
        openForm: false,
        reloadData: Math.random(),
        selectedCv: null,
      },
    })
  }
  const normFile = (e) => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }
  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const formData = new FormData()
      formData.append('name', values?.name)
      formData.append('cvFile', values?.file[0].originFileObj)
      if (selectedCv) {
        try {
          const response = await axios({
            method: 'PUT',
            url: `/api/cvs/${selectedCv?.id}`,
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          })
          if (response) {
            showSuccessMessage('Cập nhật CV thành công')
            handleCancel()
          }
        } catch (error) {
          showErrorMessage('Cập nhật CV thất bại')
        }
      } else {
        try {
          const response = await axios({
            method: 'POST',
            url: `/api/cvs`,
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          })
          if (response) {
            showSuccessMessage('Thêm CV thành công')
            handleCancel()
          }
        } catch (error) {
          showErrorMessage('Thêm CV thất bại')
        }
      }
    })
  }
  useEffect(() => {
    form.setFieldsValue({
      name: selectedCv?.name,
      file: [{ name: selectedCv?.cvUrl, url: getCV(selectedCv?.cvUrl) }],
    })
  }, [selectedCv])
  return (
    <Modal title="Thêm CV" open={openForm} onCancel={handleCancel} onOk={handleOk}>
      <Form form={form}>
        <FormItem
          name="name"
          label="Tên CV"
          rules={[{ required: true, message: 'Tên CV không được để trống' }]}
        >
          <Input />
        </FormItem>
        <Form.Item
          name="file"
          label="File CV"
          requiredMark
          required
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: 'File CV không được để trống' }]}
          // rules={[
          //   () => ({
          //     validator(_, value) {
          //       if (value?.fileList.length > 0) {
          //         return Promise.resolve()
          //       }
          //       return Promise.reject(new Error('File CV không được để trống'))
          //     },
          //   }),
          // ]}
        >
          <Upload beforeUpload={() => false} maxCount={1} accept=".pdf">
            <Button icon={<UploadOutlined />}>Chọn file</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default CvForm
