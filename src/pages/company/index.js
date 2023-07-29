/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Card, List, Pagination, Row } from 'antd'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'services/ultis/constants'
import CompanyAPI from 'services/api/company.api'
import { useSelector } from 'react-redux'
import SearchForm from './components/SearchForm'
import CompanyItem from './components/CompanyItem'

const CompanyPage = () => {
  const { searchText } = useSelector((state) => state.company)
  const [loading, setLoading] = useState(false)
  const [companyList, setCompanyList] = useState([])
  const [pagination, setPagination] = useState({
    current: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  })

  const fetchCompanies = async (keyword, page, size) => {
    setLoading(true)
    const payload = {
      page,
      size,
      'name.contains': keyword,
      sort: ['id,desc'],
    }
    const response = await CompanyAPI.search(payload)
    if (response) {
      setCompanyList(response.data.content)
      setPagination({ ...pagination, total: response.data.totalElements })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCompanies(searchText, pagination.current - 1, pagination.pageSize)
  }, [searchText, pagination.current])
  return (
    <div>
      <Helmet title="Danh sách công ty" />
      <SearchForm />
      <div style={{ width: '80%', margin: 'auto' }}>
        <Card style={{ height: '100%' }}>
          <List
            style={{ width: '100%' }}
            loading={loading}
            grid={{
              gutter: 16,
              column: 3,
            }}
            dataSource={companyList}
            renderItem={(item) => {
              return (
                <List.Item key={Math.random()}>
                  <CompanyItem item={item} />
                </List.Item>
              )
            }}
          />
          <br />
          <Row justify="center">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              defaultCurrent={1}
              hideOnSinglePage
              total={pagination.total}
              onChange={(page) => {
                setPagination({
                  ...pagination,
                  current: page,
                })
              }}
            />
          </Row>
        </Card>
      </div>
    </div>
  )
}

export default CompanyPage
