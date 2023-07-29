/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Form, Input, Modal, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'antd/lib/form/Form'
import JobCategoryAPI from 'services/api/jobCategory.api'
import { debounce } from 'lodash'
import JobFieldAPI from 'services/api/jobField.api'
import { showErrorMessage, showSuccessMessage } from 'util/notification'
import jobFieldActions from '../reducers/actions'

const JobFieldForm = () => {
  const dispatch = useDispatch()
  const { openForm, selectedJobField } = useSelector((state) => state.jobField)
  const [jobCategoryList, setJobCategoryList] = useState([])
  const [form] = useForm()
  const [loading, setLoading] = useState(false)
  const handleCancel = () => {
    dispatch({
      type: jobFieldActions.SET_STATE,
      payload: {
        openForm: false,
        selectedJobField: null,
        reloadData: Math.random(),
      },
    })
  }
  const fetchJobCategory = async (page, size) => {
    const payload = {
      page,
      size,
    }
    const response = await JobCategoryAPI.search(payload)
    if (response) {
      setJobCategoryList(response.data.content)
    }
  }
  useEffect(() => {
    form.setFieldsValue({
      name: selectedJobField?.name,
      jobCategory: selectedJobField?.jobCategory.id,
    })
  }, [selectedJobField])

  useEffect(() => {
    if (openForm) {
      fetchJobCategory(0, 1000)
    }
  }, [openForm])

  const handleCreate = async (values) => {
    setLoading(true)
    const payload = {
      name: values.name,
      jobCategory: {
        id: values.jobCategory,
      },
    }
    const response = await JobFieldAPI.create(payload)
    if (response) {
      showSuccessMessage('Thêm lĩnh vực thành công')
      handleCancel()
    } else {
      showErrorMessage('Thêm lĩnh vực thất bại')
    }
    setLoading(false)
  }
  const handleUpdate = async (id, values) => {
    setLoading(true)
    const payload = {
      name: values.name,
      jobCategory: {
        id: values.jobCategory,
      },
    }
    const response = await JobFieldAPI.update(id, payload)
    if (response) {
      showSuccessMessage('Cập nhật thông tin lĩnh vực thành công')
      handleCancel()
    } else {
      showErrorMessage('Cập nhật thông tin lĩnh vực thất bại')
    }
    setLoading(false)
  }
  return (
    <Modal
      title={selectedJobField?.id ? 'Sửa thông tin lĩnh vực' : 'Thêm lĩnh vực'}
      open={openForm}
      onCancel={handleCancel}
      confirmLoading={loading}
      onOk={() => {
        form.validateFields().then((values) => {
          if (selectedJobField?.id) {
            handleUpdate(selectedJobField.id, values)
          } else {
            handleCreate(values)
          }
        })
      }}
    >
      <Form form={form} layout="vertical" name="job_category_form">
        <Form.Item
          name="name"
          label="Tên lĩnh vực"
          rules={[
            {
              required: true,
              message: 'Tên lĩnh vực không được để trống',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="jobCategory"
          label="Ngành nghề"
          rules={[
            {
              required: true,
              message: 'Ngành nghề không được để trống',
            },
          ]}
        >
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => {
              return (option?.label).includes(input)
            }}
            filterSort={(optionA, optionB) =>
              (optionA?.label).toLowerCase().localeCompare((optionB?.label).toLowerCase())
            }
            options={jobCategoryList?.map((jobCategory) => {
              return {
                label: jobCategory.name,
                value: jobCategory.id,
              }
            })}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default JobFieldForm
