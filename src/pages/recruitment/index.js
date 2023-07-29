/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { DeleteOutlined, EditOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, Col, Input, Popconfirm, Row, Table, Tooltip } from 'antd'
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'services/ultis/constants'
import jobActions from 'pages/job/reducers/actions'
import moment from 'moment'
import JobAPI from 'services/api/job.api'
import { JOB_TYPE } from 'util/constants'
import CompanyAPI from 'services/api/company.api'
import { debounce } from 'lodash'
import { showErrorMessage, showSuccessMessage } from 'util/notification'
import recruitmentActions from './reducers/actions'
import JobForm from './components/JobForm'
import CandidateList from './components/CandidateList'

const Recruitment = () => {
  const dispatch = useDispatch()
  const { reloadData } = useSelector((state) => state.recruitment)
  const [pagination, setPagination] = useState({
    current: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  })
  const [jobList, setJobList] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentCompanyId, setCurrentCompanyId] = useState(null)
  const [searchText, setSearchText] = useState(null)
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
      title: 'Tên công việc',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    {
      title: 'Vị trí cần tuyển',
      align: 'center',
      key: 'position',
      render: (text, record) => <span>{record.position}</span>,
    },
    {
      title: 'Loại công việc',
      align: 'center',
      key: 'jobType',
      render: (text, record) => <span>{JOB_TYPE[record?.jobType].label}</span>,
    },
    {
      title: 'Hạn ứng tuyển',
      align: 'center',
      key: 'applicationDeadline',
      render: (text, record) => (
        <span>{moment(record?.applicationDeadline).format('DD-MM-YYYY')}</span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'operation',
      // width: 100,
      render: (record) => {
        return (
          <Row key={Math.random()} justify="space-between">
            <Col>
              <Tooltip title="Danh sách ứng viên">
                <TeamOutlined
                  onClick={() => {
                    dispatch({
                      type: recruitmentActions.SET_STATE,
                      payload: {
                        openCandidateList: true,
                        selectedJob: record,
                      },
                    })
                  }}
                  style={{ fontSize: '1.2rem', color: 'blue', cursor: 'pointer' }}
                />
              </Tooltip>
            </Col>
            <Col>
              <Tooltip title="Chỉnh sửa">
                <EditOutlined
                  onClick={() => {
                    dispatch({
                      type: recruitmentActions.SET_STATE,
                      payload: {
                        openForm: true,
                        selectedJob: record,
                      },
                    })
                  }}
                  style={{ fontSize: '1.2rem', color: 'blue', cursor: 'pointer' }}
                />
              </Tooltip>
            </Col>
            <Col>
              <Tooltip title="Xóa" zIndex={100}>
                <Popconfirm
                  zIndex={101}
                  placement="topLeft"
                  title="Bạn có muốn xóa công việc này không?"
                  okText="Đồng ý"
                  cancelText="Hủy bỏ"
                  onConfirm={() => {
                    handleDelete(record.id)
                  }}
                >
                  <DeleteOutlined style={{ fontSize: '1.2rem', color: 'red' }} />
                </Popconfirm>
              </Tooltip>
            </Col>
          </Row>
        )
      },
    },
  ]
  const handleChangeTable = (e) => {
    setPagination(e)
  }

  const handleDelete = async (id) => {
    try {
      const response = await JobAPI.delete(id)
      if (response) {
        showSuccessMessage('Xóa công việc thành công')
        dispatch({
          type: recruitmentActions.SET_STATE,
          payload: {
            reloadData: Math.random(),
          },
        })
      }
    } catch (error) {
      showErrorMessage('Xóa công việc thất bại')
    }
  }

  const fetchJobList = async (keyword, companyId, page, size) => {
    setLoading(true)
    const payload = {
      page,
      size,
      'companyId.equals': companyId,
      'name.contains': keyword,
      sort: 'id,desc',
    }
    const response = await JobAPI.search(payload)
    if (response) {
      setJobList(response.data.content)
      setPagination({ ...pagination, total: response.data.totalElements })
    }
    setLoading(false)
  }

  useEffect(() => {
    if (currentCompanyId) {
      fetchJobList(searchText, currentCompanyId, pagination.current - 1, pagination.pageSize)
    }
  }, [pagination.current, reloadData, currentCompanyId, searchText])

  const fetchCurrentCompany = async () => {
    const response = await CompanyAPI.getCurrentCompany()
    if (response) {
      setCurrentCompanyId(response.data.id)
    }
  }
  useEffect(() => {
    fetchCurrentCompany()
  }, [])

  const handleChangeSearchText = debounce((value) => {
    setSearchText(value)
  }, 500)
  return (
    <div>
      <Helmet title="Tuyển dụng" />
      <JobForm />
      <CandidateList />
      <Row justify="space-between">
        <Col span={8}>
          <Input.Search
            placeholder="Nhập từ khóa tìm kiếm"
            onChange={(e) => {
              handleChangeSearchText(e.target.value)
            }}
          />
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              dispatch({
                type: recruitmentActions.SET_STATE,
                payload: {
                  openForm: true,
                },
              })
            }}
          >
            Thêm mới
          </Button>
        </Col>
      </Row>
      <br />
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
          dataSource={jobList}
          rowKey="id"
          bordered
        />
      </Row>
    </div>
  )
}

export default Recruitment
