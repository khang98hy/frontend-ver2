/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Button, Form, Input, Modal, Select, Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'antd/lib/form/Form'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import Icon from '@ant-design/icons/lib/components/Icon'
import axios from 'axios'
import { showErrorMessage, showSuccessMessage } from 'util/notification'
import { getImages } from 'util/helper'
import CompanyAPI from 'services/api/company.api'
import store from 'store'
import JobFieldAPI from 'services/api/jobField.api'
import companyManagementActions from '../reducers/actions'

const CompanyForm = () => {
  const dispatch = useDispatch()
  const { openForm, selectedCompany } = useSelector((state) => state.companyManagement)
  const token = store.get('accessToken')
  const [form] = useForm()
  const [jobFieldList, setJobFieldList] = useState([])
  const handleCancel = () => {
    dispatch({
      type: companyManagementActions.SET_STATE,
      payload: {
        openForm: false,
        reloadData: Math.random(),
        selectedCompany: null,
      },
    })
    form.resetFields()
    setFileList([])
  }
  const [fileList, setFileList] = useState([])
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  )
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)

  useEffect(() => {
    if (selectedCompany) {
      form.setFieldsValue(selectedCompany)
      form.setFieldValue("jobFieldIds", selectedCompany?.jobFields?.map(item => item.id))
      if (selectedCompany?.logo) {
        setFileList([{ url: getImages(selectedCompany?.logo) }])
      }
    }
  }, [selectedCompany])

  const fetchJobFields = async () => {
    const response = await JobFieldAPI.search({
      page: 0,
      size: 1000,
    })
    if (response) {
      setJobFieldList(response.data.content)
    }
  }
  useEffect(() => {
    if (openForm) {
      fetchJobFields()
    }
  }, [openForm])
  return (
    <Modal
      title={selectedCompany?.id ? `Chỉnh sửa thông tin công ty` : `Thêm mới công ty`}
      open={openForm}
      onCancel={handleCancel}
      onOk={() => {
        form.validateFields().then(async (values) => {
          console.log('🚀 ~ file: CompanyForm.js:78 ~ form.validateFields ~ values:', values)
          const formData = new FormData()
          if (values?.name) {
            formData.append('name', values?.name)
          } else {
            formData.append('name', null)
          }
          if (values?.address) {
            formData.append('address', values?.address)
          }
          if (values?.website) {
            formData.append('website', values?.website)
          }
          if (values?.taxCode) {
            formData.append('taxCode', values?.taxCode)
          }
          if (values?.logo?.file) {
            formData.append('logo', values?.logo?.file)
          }
          if (values?.jobFieldIds) {
            formData.append('jobFieldIds', values?.jobFieldIds)
          } else {
            formData.append('jobFieldIds', [])
          }

          if (selectedCompany?.id) {
            try {
              const response = await axios({
                method: 'PUT',
                url: `/api/companies/${selectedCompany.id}`,
                data: formData,
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${token}`,
                },
              })
              if (response && response.status === 200) {
                showSuccessMessage('Cập nhật thông tin công ty thành công')
                handleCancel()
              } else {
                showErrorMessage('Cập nhật thông tin công ty thất bại')
              }
            } catch (error) {
              showErrorMessage('Cập nhật thông tin công ty thất bại')
            }
          } else {
            try {
              const response = await axios({
                method: 'POST',
                url: '/api/companies',
                data: formData,
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${token}`,
                },
              })
              if (response && response.status === 200) {
                showSuccessMessage('Thêm mới công ty thành công')
                handleCancel()
              } else {
                showErrorMessage('Thêm mới công ty thất bại')
              }
            } catch (error) {
              showErrorMessage('Thêm mới công ty thất bại')
            }
          }
        })
      }}
    >
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Form.Item
          label="Tên công ty"
          name="name"
          rules={[{ required: true, message: 'Tên công ty không được để trống' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mã số thuế"
          name="taxCode"
          rules={[{ required: true, message: 'Mã số thuế không được để trống' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Địa chỉ không được để trống' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Website" name="website">
          <Input />
        </Form.Item>
        <Form.Item label="Logo" name="logo">
          <Upload
            listType="picture-card"
            fileList={fileList}
            maxCount={1}
            onChange={handleChange}
            beforeUpload={() => false}
            accept="image/png, image/jpeg"
          >
            {uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item label="Lĩnh vực" name="jobFieldIds">
          <Select
            showSearch
            mode="multiple"
            placeholder="Chọn lĩnh vực"
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '')
                .toLowerCase()
                .localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={jobFieldList?.map((item) => {
              return {
                label: item?.name,
                value: item?.id,
              }
            })}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CompanyForm
