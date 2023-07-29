/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
import { Card, Col, Row } from 'antd'
import Link from 'antd/lib/typography/Link'
import { history } from 'index'
import React from 'react'
import { getImages } from 'util/helper'
import moment from 'moment'
import 'moment/locale/vi'

const JobItem = (props) => {
  const { item } = props
  moment.locale('vi')

  function getSalary(minSalary, maxSalary) {
    if (minSalary && maxSalary) {
      return `${minSalary
        .toString()
        .replace(/\./, ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} - ${maxSalary
        .toString()
        .replace(/\./, ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} VND`
    }
    if (!minSalary && !maxSalary) {
      return 'Thỏa thuận'
    }
    if (!minSalary && maxSalary) {
      return `Tới ${maxSalary
        .toString()
        .replace(/\./, ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} VND`
    }
    if (minSalary && !maxSalary) {
      return `Trên ${minSalary
        .toString()
        .replace(/\./, ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} VND`
    }
  }

  function getYearsOfExperience(minYearsOfExperience, maxYearsOfExperience) {
    if (minYearsOfExperience && maxYearsOfExperience) {
      return `Từ ${minYearsOfExperience} - ${maxYearsOfExperience} năm kinh nghiệm`
    }
    if (!minYearsOfExperience && !maxYearsOfExperience) {
      return 'Không yêu cầu kinh nghiệm'
    }
    if (!minYearsOfExperience && maxYearsOfExperience) {
      return `Dưới ${maxYearsOfExperience} năm kinh nghiệm`
    }
    if (minYearsOfExperience && !maxYearsOfExperience) {
      return `Ít nhất ${minYearsOfExperience} năm kinh nghiệm`
    }
  }

  function getAddress(address) {
    if (address) {
      return address
    }
    return 'Liên hệ'
  }
  return (
    <Card
      hoverable
      style={{
        width: '100%',
      }}
      onClick={() => {
        window.open(`/public/job-detail/${item.id}`, '_blank')
      }}
    >
      <Row gutter={12}>
        <Col>
          <img alt="example" src={getImages(item?.company?.logo)} width={70} height={70} />
        </Col>
        <Col>
          <div style={{ fontSize: '1.2rem', textTransform: 'capitalize', fontWeight: 'bold' }}>
            {item?.name}
          </div>
          <Link
            onClick={(e) => {
              e.stopPropagation()
              history.push(`/public/company-detail/${item?.company.id}`)
            }}
          >
            {item?.company.name}
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
            <Col span={22}>{getAddress(item?.address)}</Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row gutter={12} style={{ fontSize: '1rem' }}>
            <Col span={2}>
              <i className="fe fe-dollar-sign" />
            </Col>
            <Col span={22}>{getSalary(item?.minSalary, item?.maxSalary)}</Col>
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
              {getYearsOfExperience(item?.minYearsOfExperience, item?.maxYearsOfExperience)}
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row gutter={12} style={{ fontSize: '1rem' }}>
            <Col span={2}>
              <i className="fe fe-clock" />
            </Col>
            <Col span={22}>Cập nhật {moment(item?.lastModifiedDate).fromNow()}</Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default JobItem
