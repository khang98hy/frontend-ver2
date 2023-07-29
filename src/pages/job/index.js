/* eslint-disable no-unused-vars */
import React from 'react'
import { Helmet } from 'react-helmet'
import { Card, Col, List, Row } from 'antd'
import SearchForm from './components/SearchForm'
import FilterJob from './components/FilterJob'
import JobsList from './components/JobList'

const JobPage = () => {
  return (
    <div>
      <Helmet title="Tìm việc làm" />
      <SearchForm />
      <Row
        gutter={[16, 16]}
        style={{
          width: '80%',
          justifyContent: 'space-between',
          marginBottom: '30px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Col span={6}>
          <FilterJob />
        </Col>
        <Col span={18}>
          <JobsList />
        </Col>
      </Row>
    </div>
  )
}

export default JobPage
