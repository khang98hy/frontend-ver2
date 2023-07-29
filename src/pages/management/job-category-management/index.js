/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Col, Input, Popconfirm, Row, Table, Tooltip } from 'antd'
import { debounce } from 'lodash'
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import JobCategoryAPI from 'services/api/jobCategory.api'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'services/ultis/constants'
import { showErrorMessage, showSuccessMessage } from 'util/notification'
import JobCategoryForm from './components/JobCategoryForm'

const JobCategoryManagement = () => {
  const [pagination, setPagination] = useState({
    current: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  })
  const [jobCategoryList, setJobCategoryList] = useState([])
  const [openForm, setOpenForm] = useState(false)
  const [searchText, setSearchText] = useState()
  const [reloadData, setReloadData] = useState(0)
  const [selectedJobCategory, setSelectedJobCategory] = useState()
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
      title: 'Tên ngành nghề',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
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
                    setOpenForm(true)
                    setSelectedJobCategory(record)
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
                  title="Bạn có muốn xóa ngành nghề này không?"
                  okText="Đồng ý"
                  cancelText="Hủy bỏ"
                  onConfirm={() => {
                    handleDeleteJobCategory(record.id)
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

  const handleDeleteJobCategory = async (id) => {
    const response = await JobCategoryAPI.delete(id)
    if (response) {
      showSuccessMessage('Xóa ngành nghề thành công')
      setReloadData(Math.random())
    } else {
      showErrorMessage('Xóa ngành nghề thất bại')
    }
  }

  const fetchJobCategory = async (keyword, page, size) => {
    const payload = {
      page,
      size,
      'name.contains': keyword,
    }
    const response = await JobCategoryAPI.search(payload)
    if (response && response.status === 200) {
      setJobCategoryList(response.data.content)
      setPagination({ ...pagination, total: response.data.totalElements })
    }
  }
  useEffect(() => {
    fetchJobCategory(searchText, pagination.current - 1, pagination.pageSize)
  }, [searchText, pagination.current, reloadData])
  const handleTableChangePage = (e) => {
    setPagination({
      ...pagination,
      current: e.current,
    })
  }

  return (
    <div>
      <Helmet title="Danh sách ngành nghề" />
      <JobCategoryForm
        open={openForm}
        setOpen={setOpenForm}
        setReloadData={setReloadData}
        initialJobCategory={selectedJobCategory}
        setInitialJobCategory={setSelectedJobCategory}
      />
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
              setOpenForm(true)
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
          onChange={handleTableChangePage}
          pagination={{
            ...pagination,
            position: ['bottomCenter'],
            hideOnSinglePage: true,
          }}
          columns={columns}
          dataSource={jobCategoryList}
          rowKey="id"
          bordered
        />
      </Row>
    </div>
  )
}

export default JobCategoryManagement
