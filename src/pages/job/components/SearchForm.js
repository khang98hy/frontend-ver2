import { SearchOutlined } from '@ant-design/icons'
import { Button, Col, Input, Row } from 'antd'
import { debounce } from 'lodash'
import React from 'react'
import { useDispatch } from 'react-redux'
import jobActions from '../reducers/actions'

const SearchForm = () => {
  const dispatch = useDispatch()
  const handleChangeSearchText = debounce((value) => {
    dispatch({
      type: jobActions.SET_STATE,
      payload: {
        searchText: value,
      },
    })
  }, 500)
  return (
    <Row
      style={{
        width: '60%',
        margin: 'auto',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
      }}
    >
      <Col span={20}>
        <Input
          size="large"
          style={{ borderRadius: '10px', backgroundColor: '$gray-2' }}
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm việc làm"
          onChange={(e) => {
            handleChangeSearchText(e.target.value)
          }}
          //   onPressEnter={() => {
          //     handleSearch()
          //   }}
        />
      </Col>
      <Col span={3}>
        <Button
          type="primary"
          size="large"
          style={{ borderRadius: '10px' }}
          onClick={() => {
            // handleSearch()
          }}
        >
          Tìm kiếm
        </Button>
      </Col>
    </Row>
  )
}

export default SearchForm
