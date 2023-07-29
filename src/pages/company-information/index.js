/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Col, Form, Input, Row, Select, Upload } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import axios from 'axios'
import PersonalMenu from 'components/personal/PersonalMenu'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import CompanyAPI from 'services/api/company.api'
import JobFieldAPI from 'services/api/jobField.api'
import { getImages } from 'util/helper'
import store from 'store'
import { showErrorMessage, showSuccessMessage } from 'util/notification'

const CompanyInformation = () => {
  const [jobFieldList, setJobFieldList] = useState([])
  const token = store.get('accessToken')
  const [form] = useForm()
  const [company, setCompany] = useState()
  const fetchCurrentCompany = async () => {
    const response = await CompanyAPI.getCurrentCompany()
    if (response) {
      setCompany(response.data)
    }
  }
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
    fetchCurrentCompany()
    fetchJobFields()
  }, [])
  useEffect(() => {
    if (company) {
      form.setFieldsValue({
        ...company,
        logo: [{ url: getImages(company?.logo) }],
        jobFieldIds: company?.jobFields?.map((item) => item.id),
      })
    }
  }, [company])

  const handleUpdate = () => {
    form.validateFields().then(async (values) => {
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
      if (values?.logo?.length > 0) {
        formData.append('logo', values?.logo[0].originFileObj)
      }
      if (values?.jobFieldIds) {
        formData.append('jobFieldIds', values?.jobFieldIds)
      } else {
        formData.append('jobFieldIds', [])
      }

      if (company?.id) {
        try {
          const response = await axios({
            method: 'PUT',
            url: `/api/companies/${company.id}`,
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          })
          if (response && response.status === 200) {
            showSuccessMessage('Cập nhật thông tin công ty thành công')
          } else {
            showErrorMessage('Cập nhật thông tin công ty thất bại')
          }
        } catch (error) {
          showErrorMessage('Cập nhật thông tin công ty thất bại')
        }
      }
    })
  }

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
  const normFile = (e) => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }
  return (
    <div>
      <Helmet title="Thông tin công ty" />
      <Row gutter={16} style={{ width: '80%', margin: 'auto' }}>
        <Col span={5}>
          <PersonalMenu />
        </Col>
        <Col span={19}>
          <Card title={<h3 style={{ fontWeight: 'bold' }}>THÔNG TIN CÔNG TY</h3>}>
            <Form
              form={form}
              name="company-information"
              layout="vertical"
              labelCol={{
                offset: 4,
                span: 4,
              }}
              wrapperCol={{
                offset: 4,
                span: 16,
              }}
              autoComplete="off"
            >
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
              <Form.Item
                label="Logo"
                name="logo"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
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
            <Row justify="center">
              <Button type="primary" shape="round" onClick={handleUpdate}>
                Lưu thông tin
              </Button>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CompanyInformation
