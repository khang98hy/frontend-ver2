/* eslint-disable no-unused-vars */
import { Button, Col, Input, Row } from 'antd'
import { history } from 'index'
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SearchForm = () => {
  const [keyword, setKeyword] = useState('')

  const location = useLocation()
  useEffect(() => {
    setKeyword('')
  }, [location.pathname])
  return (
    <Row
      style={{
        width: '50%',
        margin: 'auto',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <Col span={20}>
        <Input.Search
          size="large"
          style={{ borderRadius: '10px', backgroundColor: '$gray-2' }}
          placeholder="Nhập từ khóa tìm kiếm"
          allowClear
          value={keyword}
          onChange={(value) => {
            setKeyword(value.target.value)
          }}
          onSearch={(value) => {
            if (value) {
              history.push({
                pathname: '/public/search',
                search: `keyword=${value}`,
              })
            }
          }}
        />
      </Col>
      {/* <Col span={3}>
        <Button
          type="primary"
          size="large"
          style={{ borderRadius: '10px' }}
          onClick={() => {
            if (keyword) {
              history.push({
                pathname: '/public/search',
                search: `keyword=${keyword}`,
              })
            }
          }}
        >
          Tìm kiếm
        </Button>
      </Col> */}
    </Row>
  )
}

export default SearchForm
