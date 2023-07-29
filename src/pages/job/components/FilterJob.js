/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable no-unused-vars */
import { DeleteOutlined } from '@ant-design/icons'
import {
  Affix,
  Card,
  Checkbox,
  Col,
  Collapse,
  Divider,
  Radio,
  Row,
  Space,
  Tooltip,
  Typography,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import JobAPI from 'services/api/job.api'
import JobFieldAPI from 'services/api/jobField.api'
import { CITIES, COLORS, FILTER_JOBS, FILTER_TIME_AGO, JOB_TYPE } from 'util/constants'
import jobActions from '../reducers/actions'

const FilterJob = () => {
  const dispatch = useDispatch()
  const { pagination, searchText } = useSelector((state) => state.job)
  const [selectedJobTypes, setSelectedJobTypes] = useState(null)
  const [selectedCities, setSelectedJobCities] = useState(null)
  const [selectedJobFields, setSelectedJobFields] = useState(null)
  const [selectedJobUpdateTime, setSelectedJobUpdateTime] = useState(null)
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
    fetchJobFields()
  }, [])

  const fetchJobs = async (payload) => {
    dispatch({
      type: jobActions.SET_STATE,
      payload: {
        loading: true,
      },
    })
    const response = await JobAPI.search(payload)
    if (response) {
      dispatch({
        type: jobActions.SET_STATE,
        payload: {
          jobList: response.data.content,
          pagination: { ...pagination, total: response.data.totalElements },
        },
      })
    }
    dispatch({
      type: jobActions.SET_STATE,
      payload: {
        loading: false,
      },
    })
  }
  useEffect(() => {
    const payload = {
      page: pagination.current - 1,
      size: pagination.pageSize,
      'jobFieldId.in': selectedJobFields,
      'jobType.in': selectedJobTypes,
      'address.contains': selectedCities,
      'name.contains': searchText,
      sort: 'lastModifiedDate,desc',
    }
    fetchJobs(payload)
  }, [pagination.current, selectedJobFields, selectedJobTypes, selectedCities, searchText])
  return (
    <div>
      <Card>
        <Row justify="space-between">
          <Col>
            <h5>Lọc tìm kiếm của bạn</h5>
          </Col>
          <Col>
            <Tooltip title="Đặt lại">
              <Typography.Text
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedJobCities(null)
                  setSelectedJobTypes(null)
                  setSelectedJobFields(null)
                  setSelectedJobUpdateTime(null)
                }}
              >
                <DeleteOutlined />
              </Typography.Text>
            </Tooltip>
          </Col>
        </Row>

        <Divider />
        <Collapse
          bordered={false}
          expandIconPosition="end"
          defaultActiveKey={Object.keys(FILTER_JOBS)}
        >
          <Collapse.Panel
            forceRender
            key={FILTER_JOBS.TYPE.value}
            header={FILTER_JOBS.TYPE.label}
            style={{ background: COLORS.WHITE }}
          >
            <Space direction="vertical">
              <Checkbox.Group
                value={selectedJobTypes}
                onChange={(e) => {
                  setSelectedJobTypes(e)
                }}
              >
                <Row>
                  <Checkbox value={JOB_TYPE.INTERNSHIP.value}>{JOB_TYPE.INTERNSHIP.label}</Checkbox>
                </Row>
                <Row>
                  <Checkbox value={JOB_TYPE.FULL_TIME.value}>{JOB_TYPE.FULL_TIME.label}</Checkbox>
                </Row>
                <Row>
                  <Checkbox value={JOB_TYPE.PART_TIME.value}>{JOB_TYPE.PART_TIME.label}</Checkbox>
                </Row>
                <Row>
                  <Checkbox value={JOB_TYPE.FREELANCER.value}>{JOB_TYPE.FREELANCER.label}</Checkbox>
                </Row>
              </Checkbox.Group>
            </Space>
          </Collapse.Panel>
          <Collapse.Panel
            key={FILTER_JOBS.CITY.value}
            header={FILTER_JOBS.CITY.label}
            style={{ background: COLORS.WHITE }}
          >
            <Space direction="vertical">
              <Radio.Group
                value={selectedCities}
                onChange={(e) => {
                  setSelectedJobCities(e.target.value)
                }}
              >
                {CITIES.map((e) => {
                  return (
                    <Row key={Math.random()}>
                      <Radio value={e}>{e}</Radio>
                    </Row>
                  )
                })}
              </Radio.Group>
            </Space>
          </Collapse.Panel>
          <Collapse.Panel
            key={FILTER_JOBS.FIELD.value}
            header={FILTER_JOBS.FIELD.label}
            style={{ background: COLORS.WHITE }}
          >
            <Space direction="vertical">
              <Checkbox.Group
                value={selectedJobFields}
                onChange={(e) => {
                  setSelectedJobFields(e)
                }}
              >
                {jobFieldList?.map((e) => {
                  return (
                    <Row key={Math.random()}>
                      <Checkbox value={e.id}>{e.name}</Checkbox>
                    </Row>
                  )
                })}
              </Checkbox.Group>
            </Space>
          </Collapse.Panel>
          <Collapse.Panel
            key={FILTER_JOBS.TIME.value}
            header={FILTER_JOBS.TIME.label}
            style={{ background: COLORS.WHITE }}
          >
            <Radio.Group
              value={selectedJobUpdateTime}
              onChange={(e) => {
                setSelectedJobUpdateTime(e.target.value)
              }}
            >
              <Space direction="vertical">
                <Radio value={FILTER_TIME_AGO.DAY.value}>{FILTER_TIME_AGO.DAY.label}</Radio>
                <Radio value={FILTER_TIME_AGO.WEEK.value}>{FILTER_TIME_AGO.WEEK.label}</Radio>
                <Radio value={FILTER_TIME_AGO.MONTH.value}>{FILTER_TIME_AGO.MONTH.label}</Radio>
                <Radio value={FILTER_TIME_AGO.EVERYTIME.value}>
                  {FILTER_TIME_AGO.EVERYTIME.label}
                </Radio>
              </Space>
            </Radio.Group>
          </Collapse.Panel>
        </Collapse>
      </Card>
    </div>
  )
}

export default FilterJob
