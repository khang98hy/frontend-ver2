/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import FormItem from 'antd/es/form/FormItem'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useForm } from 'antd/lib/form/Form'
import { JOB_TYPE } from 'util/constants'
import JobAPI from 'services/api/job.api'
import { showErrorMessage, showSuccessMessage } from 'util/notification'
import React, { useState, useEffect } from 'react'
import JobFieldAPI from 'services/api/jobField.api'
import moment from 'moment'
import recruitmentActions from '../reducers/actions'

const JobForm = () => {
  const dispatch = useDispatch()
  const { openForm, selectedJob } = useSelector((state) => state.recruitment)
  const [form] = useForm()
  const [jobFieldList, setJobFieldList] = useState([])

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
  useEffect(() => {
    if (selectedJob) {
      form.setFieldsValue({
        ...selectedJob,
        applicationDeadline: moment(selectedJob?.applicationDeadline),
        jobFieldId: selectedJob?.jobField?.id,
      })
    }
  }, [selectedJob])
  const handleCancel = () => {
    form.resetFields()
    dispatch({
      type: recruitmentActions.SET_STATE,
      payload: {
        openForm: false,
        reloadData: Math.random(),
        selectedJob: null,
      },
    })
  }
  const handleOk = async () => {
    const values = await form.validateFields()
    const payload = {
      ...values,
      jobField: {
        id: values?.jobFieldId,
      },
    }
    if (selectedJob?.id) {
      try {
        const response = await JobAPI.update(selectedJob?.id, payload)
        if (response) {
          showSuccessMessage('Cập nhật công việc thành công')
          handleCancel()
        } else {
          showErrorMessage('Cập nhật công việc thất bại')
        }
      } catch (error) {
        showErrorMessage('Cập nhật công việc thất bại')
      }
    } else {
      try {
        const response = await JobAPI.create(payload)
        if (response) {
          showSuccessMessage('Thêm công việc thành công')
          handleCancel()
        } else {
          showErrorMessage('Thêm công việc thất bại')
        }
      } catch (error) {
        showErrorMessage('Thêm công việc thất bại')
      }
    }
  }
  return (
    <Modal
      title={selectedJob?.id ? 'Chỉnh sửa công việc' : 'Thêm công việc'}
      open={openForm}
      onCancel={handleCancel}
      width="60%"
      onOk={handleOk}
    >
      <Form form={form} layout="vertical" scrollToFirstError>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <FormItem
              name="name"
              label="Tên công việc"
              rules={[{ required: true, message: 'Tên công việc không được để trống' }]}
            >
              <Input />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              name="position"
              label="Vị trí cần tuyển"
              rules={[{ required: true, message: 'Vị trí cần tuyển không được để trống' }]}
            >
              <Input />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <FormItem
              name="jobType"
              label="Loại công việc"
              rules={[{ required: true, message: 'Loại công việc không được để trống' }]}
            >
              <Select
                placeholder="Chọn loại công việc"
                options={[
                  { label: JOB_TYPE.FULL_TIME.label, value: JOB_TYPE.FULL_TIME.value },
                  { label: JOB_TYPE.PART_TIME.label, value: JOB_TYPE.PART_TIME.value },
                  { label: JOB_TYPE.INTERNSHIP.label, value: JOB_TYPE.INTERNSHIP.value },
                  { label: JOB_TYPE.FREELANCER.label, value: JOB_TYPE.FREELANCER.value },
                ]}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              name="jobFieldId"
              label="Lĩnh vực"
              rules={[{ required: true, message: 'Lĩnh vực không được để trống' }]}
            >
              <Select
                showSearch
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
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <FormItem label="Mức lương tối thiểu" name="minSalary">
              <InputNumber addonAfter="VNĐ" />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Mức lương tối đa" name="maxSalary">
              <InputNumber addonAfter="VNĐ" />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <FormItem name="minYearsOfExperience" label="Số năm kinh nghiệm tối thiểu">
              <InputNumber addonAfter="Năm" />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem name="maxYearsOfExperience" label="Số năm kinh nghiệm tối đa">
              <InputNumber addonAfter="Năm" />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <FormItem
              name="applicationDeadline"
              label="Hạn ứng tuyển"
              rules={[{ required: true, message: 'Hạn ứng tuyển không được để trống' }]}
            >
              <DatePicker />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="Số lượng cần tuyển"
              name="numberOfVacancy"
              rules={[{ required: true, message: 'Số lượng cần tuyển không được để trống' }]}
            >
              <InputNumber addonAfter="người" />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <FormItem label="Thời gian làm việc" name="workTime">
              <Input.TextArea />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Địa điểm làm việc" name="address">
              <Input.TextArea />
            </FormItem>
          </Col>
        </Row>

        <FormItem name="description" label="Mô tả">
          <ReactQuill />
        </FormItem>
        <FormItem name="requirement" label="Yêu cầu">
          <ReactQuill />
        </FormItem>
        <FormItem name="benefit" label="Quyền lợi">
          <ReactQuill />
        </FormItem>
      </Form>
    </Modal>
  )
}

export default JobForm
