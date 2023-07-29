/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Col, Input, Popconfirm, Row, Table, Tooltip } from 'antd'
import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'services/ultis/constants'
import JobFieldAPI from 'services/api/jobField.api'
import { showErrorMessage, showSuccessMessage } from 'util/notification'
import JobFieldForm from './components/JobFieldForm'
import jobFieldActions from './reducers/actions'

const JobFieldManagement = () => {
  const [searchText, setSearchText] = useState()
  const { reloadData } = useSelector((state) => state.jobField)
  const dispatch = useDispatch()
  const [jobFieldList, setJobFieldList] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  })
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
      title: 'Tên lĩnh vực',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    {
      title: 'Ngành nghề',
      align: 'center',
      key: 'jobCategory.name',
      render: (text, record) => <span>{record.jobCategory.name}</span>,
    },
    {
      title: 'Thao tác',
      key: 'operation',
      width: 100,
      render: (record) => {
        return (
          <Row key={Math.random()} justify="space-around">
            <Col>
              <Tooltip title="Chỉnh sửa">
                <EditOutlined
                  onClick={() => {
                    dispatch({
                      type: jobFieldActions.SET_STATE,
                      payload: {
                        openForm: true,
                        selectedJobField: record,
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
                  title="Bạn có muốn xóa lĩnh vực này không?"
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
  const handleChangeSearchText = debounce((value) => {
    setSearchText(value)
  }, 500)

  const handleDelete = async (id) => {
    const response = await JobFieldAPI.delete(id)
    if (response) {
      showSuccessMessage('Xóa lĩnh vực thành công')
      dispatch({
        type: jobFieldActions.SET_STATE,
        payload: {
          reloadData: Math.random(),
        },
      })
    } else {
      showErrorMessage('Xóa lĩnh vực thất bại')
    }
  }

  const fetchJobField = async (keyword, page, size) => {
    setLoading(true)
    const payload = {
      page,
      size,
      'name.contains': keyword,
    }
    const response = await JobFieldAPI.search(payload)
    if (response) {
      setJobFieldList(response.data.content)
      setPagination({
        ...pagination,
        total: response.data.totalElements,
      })
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchJobField(searchText, pagination.current - 1, pagination.pageSize)
  }, [searchText, reloadData, pagination.current])
  return (
    <div>
      <Helmet title="Danh sách lĩnh vực" />
      <JobFieldForm />
      <Row justify="space-between">
        <Col xs={8}>
          <Input.Search
            size="large"
            allowClear
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
                type: jobFieldActions.SET_STATE,
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
          // onChange={handleTableChangePage}
          pagination={{
            ...pagination,
            position: ['bottomCenter'],
            hideOnSinglePage: true,
          }}
          columns={columns}
          dataSource={jobFieldList}
          rowKey="id"
          bordered
        />
      </Row>
    </div>
  )
}

export default JobFieldManagement
