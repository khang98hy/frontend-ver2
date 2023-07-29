/* eslint-disable no-unused-vars */
import { Card, Col, List, Pagination, Row } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import JobItem from './JobItem'
import jobActions from '../reducers/actions'

const JobsList = () => {
  const dispatch = useDispatch()
  const { jobList, loading } = useSelector((state) => state.job)
  return (
    <Card style={{ height: '100%' }}>
      <List
        style={{ width: '100%' }}
        grid={{
          gutter: 16,
          column: 1,
        }}
        loading={loading}
        dataSource={jobList}
        renderItem={(item) => (
          <List.Item key={Math.random()}>
            <JobItem item={item} />
          </List.Item>
        )}
      />
      <br />
      <Row justify="center">
        <Pagination
          defaultCurrent={1}
          hideOnSinglePage
          onChange={(e) => {
            dispatch({
              type: jobActions.SET_STATE,
              payload: {
                pagination: e,
              },
            })
          }}
        />
      </Row>
    </Card>
  )
}

export default JobsList
