/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Col, Input, Row, Switch, Table } from 'antd'
import { debounce } from 'lodash'
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import UserAPI from 'services/api/user.api'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'services/ultis/constants'
import { getRoles } from 'util/helper'
import { showErrorMessage, showSuccessMessage } from 'util/notification'

const UserManagement = () => {
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  })
  const [userList, setUserList] = useState([])
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
      title: 'Tên đăng nhập',
      dataIndex: 'login',
      align: 'center',
      key: 'username',
    },
    {
      title: 'Email',
      align: 'center',
      key: 'email',
      render: (text, record) => <span>{record.email}</span>,
    },
    {
      title: 'Quyền',
      align: 'center',
      key: 'roles',
      render: (text, record) => <span>{getRoles(record?.authorities)}</span>,
    },
    {
      title: 'Trạng thái',
      align: 'center',
      key: 'status',
      render: (text, record) => (
        <Switch
          defaultChecked={record?.activated}
          onChange={(e) => {
            handleUpdateStatus(record.id, e)
          }}
        />
      ),
    },
  ]

  const fetchUsers = async (payload) => {
    setLoading(true)
    const response = await UserAPI.searchUser(payload)
    if (response) {
      setUserList(response.data.content)
      setPagination({ ...pagination, total: response.data.totalElements })
    }
    setLoading(false)
  }

  useEffect(() => {
    const payload = {
      page: pagination.current - 1,
      size: pagination.page,
      'email.contains': searchText,
    }
    fetchUsers(payload)
  }, [pagination.current, searchText])

  const handleChangeTable = (e) => {
    setPagination(e)
  }
  const handleChangeSearchText = debounce((value) => {
    setSearchText(value)
  }, 500)

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await UserAPI.updateStatus(id, status)
      if (response) {
        showSuccessMessage('Cập nhật thông tin tài khoản thành công')
      }
    } catch (error) {
      showErrorMessage('Cập nhật thông tin tài khoản thất bại')
    }
  }
  return (
    <div>
      <Helmet title="Quản lý tài khoản" />
      <Row justify="space-between">
        <Col xs={8}>
          <Input.Search
            size="large"
            allowClear
            placeholder="Nhập từ khóa tìm kiếm theo email"
            onChange={(e) => {
              handleChangeSearchText(e.target.value)
            }}
          />
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
          dataSource={userList}
          rowKey="id"
          bordered
        />
      </Row>
    </div>
  )
}

export default UserManagement
