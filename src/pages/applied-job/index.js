/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Card, List, Pagination, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import ApplicationJobAPI from 'services/api/applicationJob.api'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'services/ultis/constants'
import MessageAPI from 'services/api/message.api'
import ChatDrawer from 'components/ChatDrawer'
import ApplicationJobItem from './components/ApplicationJobItem'

const AppliedJob = () => {
  const { jobSeekerId } = useSelector((state) => state.user)
  const [applicationJobs, setApplicationJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [pagination, setPagination] = useState({
    current: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  })
  const [openChatDrawer, setOpenChatDrawer] = useState(false)
  const [selectedApplicationJob, setSelectedApplicationJob] = useState(null)
  async function countByMessageNotRead(applicationJobId) {
    const response = await MessageAPI.count(applicationJobId)
    if (response) {
      return response.data
    }
    return 0
  }
  const fetchApplicationJobs = async (payload) => {
    setLoading(true)
    const response = await ApplicationJobAPI.search(payload)
    if (response) {
      setApplicationJobs(
        await Promise.all(
          response.data.content.map(async (item) => {
            const count = await countByMessageNotRead(item.id)
            return {
              ...item,
              countByMessageNotRead: count,
            }
          }),
        ),
      )
      setPagination({ ...pagination, total: response.data.totalElements })
    }
    setLoading(false)
  }
  useEffect(() => {
    if (selectedApplicationJob) {
      setApplicationJobs([
        ...applicationJobs?.map((item) => {
          if (item.id === selectedApplicationJob?.id) {
            item.countByMessageNotRead = 0
          }
          return item
        }),
      ])
    }
  }, [openChatDrawer, selectedApplicationJob])
  useEffect(() => {
    const payload = {
      page: pagination.current - 1,
      size: pagination.pageSize,
      'jobSeekerId.equals': jobSeekerId,
      sort: 'id,desc',
      'applicationStatus.equals': status,
    }
    fetchApplicationJobs(payload)
  }, [pagination.current, jobSeekerId, status])
  return (
    <div>
      <Helmet title="Việc làm đã ứng tuyển" />
      <ChatDrawer
        open={openChatDrawer}
        setOpen={setOpenChatDrawer}
        applicationJob={selectedApplicationJob}
      />

      <div style={{ width: '80%', margin: 'auto' }}>
        <Card
          title="Công việc đã ứng tuyển"
          loading={loading}
          extra={
            <Select
              placeholder="Trạng thái"
              options={[
                { value: 'PENDING', label: 'Đã ứng tuyển' },
                { value: 'ACCEPTED', label: 'NTD chấp nhận hồ sơ' },
                { value: 'REJECTED', label: 'Hồ sơ bị từ chối' },
              ]}
              dropdownMatchSelectWidth={false}
              allowClear
              onChange={(e) => {
                setStatus(e)
              }}
            />
          }
        >
          <List
            style={{ width: '100%' }}
            grid={{
              gutter: 16,
              column: 1,
            }}
            loading={loading}
            dataSource={applicationJobs}
            renderItem={(item) => (
              <List.Item key={Math.random()}>
                <ApplicationJobItem
                  item={item}
                  setSelectedApplicationJob={setSelectedApplicationJob}
                  setOpenChatDrawer={setOpenChatDrawer}
                />
              </List.Item>
            )}
          />
          <br />
          <Row justify="center">
            <Pagination
              defaultCurrent={1}
              hideOnSinglePage
              onChange={(e) => {
                setPagination(e)
              }}
            />
          </Row>
        </Card>
      </div>
    </div>
  )
}

export default AppliedJob
