/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Badge, Col, Drawer, Popconfirm, Row, Table, Tag, Tooltip } from 'antd'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CheckOutlined,
  EyeOutlined,
  PhoneOutlined,
  StopOutlined,
  WechatOutlined,
} from '@ant-design/icons'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'services/ultis/constants'
import ApplicationJobAPI from 'services/api/applicationJob.api'
import { getCV, getLabelStatusOfApplicationJob } from 'util/helper'
import { history } from 'index'
import { Link } from 'react-router-dom'
import { showErrorMessage, showSuccessMessage } from 'util/notification'
import moment from 'moment'
import ChatDrawer from 'components/ChatDrawer'
import MessageAPI from 'services/api/message.api'
import recruitmentActions from '../reducers/actions'
import AcceptForm from './AcceptForm'

const CandidateList = () => {
  const dispatch = useDispatch()
  const { openCandidateList, selectedJob, reloadCandidate } = useSelector(
    (state) => state.recruitment,
  )
  const [pagination, setPagination] = useState({
    current: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  })
  const [loading, setLoading] = useState(false)
  const [applicationJobList, setApplicationJobList] = useState([])
  const [openChatDrawer, setOpenChatDrawer] = useState(false)
  const [selectedApplicationJob, setSelectedApplicationJob] = useState()

  async function countByMessageNotRead(applicationJobId) {
    const response = await MessageAPI.count(applicationJobId)
    if (response) {
      return response.data
    }
    return 0
  }
  const columns = [
    {
      title: 'STT',
      align: 'center',
      key: 'stt',
      width: 100,
      render: (text, record, index) => (
        <span>{(pagination.current - 1) * pagination.pageSize + index + 1}</span>
      ),
    },
    {
      title: 'Ứng viên',

      align: 'center',
      key: 'name',
      render: (text, record) => <span>{record.jobSeeker?.fullname}</span>,
    },
    {
      title: 'Email',
      align: 'center',
      key: 'email',
      render: (text, record) => <span>{record.jobSeeker?.user.email}</span>,
    },
    {
      title: 'Giới thiệu',
      align: 'center',
      key: 'introduction',
      render: (text, record) => <span>{record.introduction}</span>,
    },
    {
      title: 'Thời gian phỏng vấn',
      align: 'center',
      key: 'interviewTime',
      render: (text, record) => {
        if (record?.interviewTime) {
          return <span>{moment(record.interviewTime).format('DD-MM-YYYY HH:mm')}</span>
        }
        return <span>Chưa có</span>
      },
    },
    {
      title: 'Trạng thái',
      align: 'center',
      key: 'introduction',
      render: (text, record) => (
        <Tag color={getLabelStatusOfApplicationJob(record.status).color}>
          {getLabelStatusOfApplicationJob(record.status).label}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'operation',
      width: 120,
      render: (record) => {
        return (
          <Row key={Math.random()} gutter={16}>
            <Col>
              <Tooltip title="Xem CV">
                <EyeOutlined
                  onClick={() => {
                    window.open(getCV(record.cvUrl), '_blank')
                  }}
                  style={{ fontSize: '1.2rem', color: 'blue', cursor: 'pointer' }}
                />
              </Tooltip>
            </Col>
            <Col>
              <Tooltip title="Nhắn tin">
                <Badge count={record?.countByMessageNotRead}>
                  <WechatOutlined
                    onClick={() => {
                      setOpenChatDrawer(true)
                      setSelectedApplicationJob(record)
                    }}
                    style={{ fontSize: '1.2rem', color: 'blue', cursor: 'pointer' }}
                  />
                </Badge>
              </Tooltip>
            </Col>
            {record.status === 'PENDING' && (
              <Col>
                <Tooltip title="Chấp nhận">
                  <CheckOutlined
                    onClick={() => {
                      dispatch({
                        type: recruitmentActions.SET_STATE,
                        payload: {
                          openAcceptForm: true,
                          selectedApplicationJob: record,
                        },
                      })
                    }}
                    style={{ fontSize: '1.2rem', color: 'blue', cursor: 'pointer' }}
                  />
                </Tooltip>
              </Col>
            )}
            {record.status === 'PENDING' && (
              <Col>
                <Tooltip title="Từ chối">
                  <Popconfirm
                    zIndex={10001}
                    placement="topLeft"
                    title="Bạn có chắc chắn từ chối ứng viên này không?"
                    okText="Đồng ý"
                    cancelText="Hủy bỏ"
                    onConfirm={() => {
                      handleRejectApplicationJob(record.id)
                    }}
                  >
                    <StopOutlined style={{ fontSize: '1.2rem', color: 'red', cursor: 'pointer' }} />
                  </Popconfirm>
                </Tooltip>
              </Col>
            )}
            {record.status === 'ACCEPTED' && (
              <Col>
                <Tooltip title="Vào phòng phỏng vấn">
                  <Link to={`/room/${record.roomId}`} target="_blank">
                    <PhoneOutlined
                      style={{ fontSize: '1.2rem', color: 'blue', cursor: 'pointer' }}
                    />
                  </Link>
                </Tooltip>
              </Col>
            )}
          </Row>
        )
      },
    },
  ]
  const handleCancel = () => {
    dispatch({
      type: recruitmentActions.SET_STATE,
      payload: {
        openCandidateList: false,
        selectedJob: null,
      },
    })
  }

  const handleRejectApplicationJob = async (id) => {
    try {
      const response = await ApplicationJobAPI.reject(id)
      if (response) {
        showSuccessMessage('Đã gửi thông báo từ chối thành công')
        dispatch({
          type: recruitmentActions.SET_STATE,
          payload: {
            reloadCandidate: Math.random(),
          },
        })
      }
    } catch (error) {
      showErrorMessage('Gửi thông báo từ chối thất bại. Vui lòng thử lại')
    }
  }
  const handleChangeTable = (e) => {
    setPagination(e)
  }

  const fetchApplicationJobs = async (payload) => {
    setLoading(true)
    const response = await ApplicationJobAPI.search(payload)
    if (response) {
      setApplicationJobList(
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
    if (selectedJob) {
      const payload = {
        page: pagination.current - 1,
        size: pagination.pageSize,
        'jobId.equals': selectedJob.id,
        sort: 'id,asc',
      }
      fetchApplicationJobs(payload)
    }
  }, [selectedJob, pagination.current, reloadCandidate])
  useEffect(() => {
    if (!openChatDrawer) {
      dispatch({
        type: recruitmentActions.SET_STATE,
        payload: {
          reloadCandidate: Math.random(),
        },
      })
    }
  }, [openChatDrawer])
  return (
    <Drawer
      title="Danh sách ứng viên"
      open={openCandidateList}
      onClose={handleCancel}
      width="80%"
      destroyOnClose
    >
      <AcceptForm />
      <ChatDrawer
        open={openChatDrawer}
        setOpen={setOpenChatDrawer}
        applicationJob={selectedApplicationJob}
      />
      <Row style={{ width: '100%' }}>
        <Table
          style={{ width: '100%' }}
          loading={loading}
          onChange={handleChangeTable}
          pagination={{
            ...pagination,
            position: ['bottomCenter'],
            hideOnSinglePage: true,
          }}
          columns={columns}
          dataSource={applicationJobList}
          rowKey="id"
          bordered
        />
      </Row>
    </Drawer>
  )
}

export default CandidateList
