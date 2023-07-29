/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Badge, Button, Card, Col, Row, Space, Tag } from 'antd'
import { history } from 'index'
import React, { useState, useEffect } from 'react'
import { getAddress, getCV, getImages, getSalary, getYearsOfExperience } from 'util/helper'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { EyeOutlined, PhoneOutlined, WechatOutlined } from '@ant-design/icons'
import ChatDrawer from 'components/ChatDrawer'
import MessageAPI from 'services/api/message.api'

const ApplicationJobItem = (props) => {
  const { item, setSelectedApplicationJob, setOpenChatDrawer } = props

  function getStatus(status) {
    if (status === 'PENDING') {
      return {
        label: 'Đã ứng tuyển',
        color: 'blue',
      }
    }
    if (status === 'ACCEPTED') {
      return {
        label: 'NTD chấp nhận hồ sơ',
        color: 'green',
      }
    }
    return {
      label: 'Hồ sơ bị từ chối',
      color: 'red',
    }
  }

  return (
    <div>
      <Badge.Ribbon text={getStatus(item?.status).label} color={getStatus(item?.status).color}>
        <Card
          hoverable
          style={{
            width: '100%',
          }}
          onClick={() => {
            window.open(`/public/job-detail/${item?.job.id}`, '_blank')
          }}
          actions={[
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                window.open(getCV(item?.cvUrl), '_blank')
              }}
              type="primary"
            >
              Xem CV
            </Button>,
            <Badge count={item?.countByMessageNotRead}>
              <Button
                icon={<WechatOutlined />}
                type="primary"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedApplicationJob(item)
                  setOpenChatDrawer(true)
                }}
              >
                Nhắn tin
              </Button>
            </Badge>,
            item?.status === 'ACCEPTED' && (
              <Button
                icon={<PhoneOutlined />}
                type="primary"
                onClick={() => {
                  window.open(`/room/${item?.roomId}`, '_blank')
                }}
              >
                Vào phòng phỏng vấn
              </Button>
            ),
            // item?.status === 'ACCEPTED' && (
            //   <Tag color="green">
            //     Thời gian phỏng vấn: {moment(item?.interviewTime).format('DD-MM-YYYY HH:mm')}
            //   </Tag>
            // ),
          ]}
        >
          <Row gutter={12}>
            <Col>
              <img alt="example" src={getImages(item?.job?.company?.logo)} width={70} height={70} />
            </Col>
            <Col>
              <div style={{ fontSize: '1.2rem', textTransform: 'capitalize', fontWeight: 'bold' }}>
                {item.job?.name}
              </div>
              <Link
                onClick={(e) => {
                  e.stopPropagation()
                  history.push(`/public/company-detail/${item.job?.company.id}`)
                }}
              >
                {item.job?.company.name}
              </Link>
            </Col>
          </Row>
          <br />
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Row gutter={12} style={{ fontSize: '1rem' }}>
                <Col span={2}>
                  <i className="fe fe-map-pin" />
                </Col>
                <Col span={22}>{getAddress(item.job?.address)}</Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row gutter={12} style={{ fontSize: '1rem' }}>
                <Col span={2}>
                  <i className="fe fe-dollar-sign" />
                </Col>
                <Col span={22}>{getSalary(item.job?.minSalary, item.job?.maxSalary)}</Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Row gutter={12} style={{ fontSize: '1rem' }}>
                <Col span={2}>
                  <i className="fe fe-briefcase" />
                </Col>
                <Col span={22}>
                  {getYearsOfExperience(
                    item.job?.minYearsOfExperience,
                    item.job?.maxYearsOfExperience,
                  )}
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row gutter={12} style={{ fontSize: '1rem' }}>
                <Col span={2}>
                  <i className="fe fe-clock" />
                </Col>
                <Col span={22}>Cập nhật {moment(item.job?.lastModifiedDate).fromNow()}</Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Badge.Ribbon>
    </div>
  )
}

export default ApplicationJobItem
