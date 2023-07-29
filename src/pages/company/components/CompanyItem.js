/* eslint-disable no-unused-vars */
import { Card, Col, Row, Space, Tag } from 'antd'
import Link from 'antd/lib/typography/Link'
import { history } from 'index'
import React from 'react'
import { getImages } from 'util/helper'

const CompanyItem = (props) => {
  const { item } = props
  return (
    <Card
      hoverable
      style={{
        width: '100%',
      }}
      onClick={() => {
        // window.open(`/public/company-detail/${item.id}`)
      }}
    >
      <Row gutter={12}>
        <Col>
          <img alt="example" src={getImages(item?.logo)} width={70} height={70} />
        </Col>
        <Col>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{item?.name}</div>
          <div>{item?.address ? item.address : 'Chưa có'}</div>
        </Col>
      </Row>
      <br />
      <Row gutter={12} style={{ fontSize: '1rem' }}>
        <Col>
          <i className="fe fe-flag" />
        </Col>
        <Col>
          {item?.jobFields ? (
            <Space>
              {item?.jobFields?.map((jobField) => {
                return <Tag color="orange">{jobField?.name}</Tag>
              })}
            </Space>
          ) : (
            'Chưa có lĩnh vực'
          )}
        </Col>
      </Row>
      <Row gutter={12} style={{ fontSize: '1rem' }}>
        <Col>
          <i className="fe fe-briefcase" />
        </Col>
        <Col>{item?.numberOfJob ? item.numberOfJob : 0} vị trí đang tuyển</Col>
      </Row>
    </Card>
  )
}

export default CompanyItem
