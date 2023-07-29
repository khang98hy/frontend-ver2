/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Col, Input, Popconfirm, Row, Table, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'services/ultis/constants'
import CompanyAPI from 'services/api/company.api'
import { debounce } from 'lodash'
import { showErrorMessage, showSuccessMessage } from 'util/notification'
import companyManagementActions from './reducers/actions'
import CompanyForm from './components/CompanyForm'

const CompanyManagement = () => {
  const dispatch = useDispatch()
  const { reloadData } = useSelector((state) => state.companyManagement)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  })
  const [companyList, setCompanyList] = useState([])
  const [searchText, setSearchText] = useState()
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
      title: 'Tên công ty',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    {
      title: 'Mã số thuế',
      align: 'center',
      key: 'taxCode',
      render: (text, record) => <span>{record.taxCode}</span>,
    },
    {
      title: 'Địa chỉ',
      align: 'center',
      key: 'taxCode',
      render: (text, record) => <span>{record?.address}</span>,
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
                      type: companyManagementActions.SET_STATE,
                      payload: {
                        openForm: true,
                        selectedCompany: record,
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
                  title="Bạn có muốn xóa công ty này không?"
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

  const fetchAllCompanies = async (keyword, page, size) => {
    setLoading(true)
    const payload = {
      page,
      size,
      'name.contains': keyword,
      sort: 'id,desc',
    }
    const response = await CompanyAPI.search(payload)
    if (response) {
      setCompanyList(response.data.content)
      setPagination({ ...pagination, total: response.data.totalElements })
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchAllCompanies(searchText, pagination.current - 1, pagination.pageSize)
  }, [reloadData, pagination.current, pagination.pageSize, searchText])
  const handleChangeTable = (e) => {
    setPagination(e)
  }
  const handleChangeSearchText = debounce((value) => {
    setSearchText(value)
  }, 500)

  const handleDelete = async (id) => {
    const response = await CompanyAPI.delete(id)
    if (response) {
      showSuccessMessage('Xóa công ty thành công')
      dispatch({
        type: companyManagementActions.SET_STATE,
        payload: {
          reloadData: Math.random(),
        },
      })
    } else {
      showErrorMessage('Xóa công ty thất bại')
    }
  }
  return (
    <div>
      <Helmet title="Danh sách công ty" />
      <CompanyForm />
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
                type: companyManagementActions.SET_STATE,
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
          dataSource={companyList}
          rowKey="id"
          bordered
        />
      </Row>
    </div>
  )
}

export default CompanyManagement
