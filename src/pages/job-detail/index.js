/* eslint-disable no-unused-vars */
import { ShareAltOutlined } from '@ant-design/icons'
import { Button, Card, Col, Divider, Row, Space, Tag, notification } from 'antd'
import Link from 'antd/lib/typography/Link'
import { history } from 'index'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'
import { v4 } from 'uuid'
import JobAPI from 'services/api/job.api'
import { getImages, getSalary, getYearsOfExperience } from 'util/helper'
import moment from 'moment'
import CompanyAPI from 'services/api/company.api'
import JobItem from 'pages/job/components/JobItem'
import { useSelector } from 'react-redux'
import styles from './style.module.scss'
import ApplyForm from './components/ApplyForm'

const JobDetail = () => {
  // get id from path url
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [similarJobs, setSimilarJobs] = useState([])
  const { authorized } = useSelector((state) => state.user)
  const [company, setCompany] = useState(null)
  const [openApplyForm, setOpenApplyForm] = useState(false)
  const fetchJob = async (jobId) => {
    const response = await JobAPI.findById(jobId)
    if (response) {
      setJob(response.data)
    }
  }
  useEffect(() => {
    fetchJob(id)
  }, [id])

  const fetchCompany = async (companyId) => {
    const response = await CompanyAPI.findById(companyId)
    if (response) {
      setCompany(response.data)
    }
  }
  useEffect(() => {
    if (job?.company?.id) {
      fetchCompany(job?.company.id)
    }
  }, [job])

  const fetchSimilarJob = async (payload) => {
    const response = await JobAPI.search(payload)
    if (response) {
      setSimilarJobs(response.data.content)
    }
  }
  useEffect(() => {
    const payload = {
      page: 0,
      size: 3,
      sort: 'id,desc',
      'id.notEquals': id,
      'jobFieldId.equals': job?.jobField?.id,
    }
    fetchSimilarJob(payload)
  }, [id, job])

  const handleApply = () => {
    if (authorized) {
      setOpenApplyForm(true)
    } else {
      notification.info({
        message: 'Vui lòng đăng nhập để ứng tuyển',
      })
    }
  }

  // const handleContact = () => {
  //   if (authorized) {
  //   } else {
  //     notification.info({
  //       message: 'Vui lòng đăng nhập để ứng tuyển',
  //     })
  //   }
  // }
  return (
    <div>
      <Helmet title="Tuyển dụng việc làm" />
      <ApplyForm open={openApplyForm} setOpen={setOpenApplyForm} jobId={job?.id} />
      <Row
        gutter={[16, 16]}
        style={{
          width: '70%',
          justifyContent: 'space-between',
          marginBottom: '30px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Col span={16}>
          <Row gutter={16}>
            <Col lg={4}>
              <img alt="example" src={getImages(job?.company?.logo)} width={100} height={100} />
            </Col>
            <Col lg={20}>
              <h3 style={{ textTransform: 'capitalize' }}>{job?.name}</h3>
              <Link
                onClick={(e) => {
                  e.stopPropagation()
                  history.push(`/public/company-detail/${job?.company?.id}`)
                }}
              >
                {job?.company?.name}
              </Link>
            </Col>
          </Row>
          <Row gutter={12} style={{ marginTop: '20px' }}>
            <Col>
              <i className="fe fe-map-pin" />
            </Col>
            <Col>{job?.address}</Col>
          </Row>
          <Row gutter={12} style={{ marginTop: '10px' }}>
            <Col>
              <i className="fe fe-dollar-sign" />
            </Col>
            <Col>{getSalary(job?.minSalary, job?.maxSalary)}</Col>
          </Row>
          <Row gutter={12} style={{ marginTop: '10px' }}>
            <Col>
              <i className="fe fe-briefcase" />
            </Col>
            <Col>{getYearsOfExperience(job?.minYearsOfExperience, job?.maxYearsOfExperience)}</Col>
          </Row>
          <Row gutter={12} style={{ marginTop: '10px' }}>
            <Col>
              <i className="fe fe-clock" />
            </Col>
            <Col>
              <div>Cập nhật {moment(job?.lastModifiedDate).fromNow()}</div>
            </Col>
          </Row>
          <Row gutter={24} style={{ marginTop: '30px' }}>
            <Col>
              <Button
                type="primary"
                size="large"
                style={{ fontWeight: 'bold' }}
                onClick={handleApply}
              >
                ỨNG TUYỂN NHANH
              </Button>
            </Col>
            {/* <Col>
              <Button
                className={styles.button_ghost_primary}
                style={{ fontWeight: 'bold' }}
                type="primary"
                size="large"
                ghost
                icon={<ShareAltOutlined />}
                onClick={handleContact}
              >
                CHIA SẺ
              </Button>
            </Col> */}
            {/* <Col>
              <Button
                className={styles.button_ghost_primary}
                style={{ fontWeight: 'bold' }}
                type="primary"
                size="large"
                ghost
                icon={<ShareAltOutlined />}
                onClick={handleContact}
              >
                LIÊN HỆ
              </Button>
            </Col> */}
          </Row>
          <Divider />
          <strong>Mô tả công việc</strong>
          <div dangerouslySetInnerHTML={{ __html: job?.description }} />
          <Divider />
          <strong>Yêu cầu</strong>
          <div dangerouslySetInnerHTML={{ __html: job?.requirement }} />
          <Divider />
          <strong>Quyền lợi</strong>
          <div dangerouslySetInnerHTML={{ __html: job?.benefit }} />
        </Col>
        <Col span={8}>
          <Card>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Thông tin công ty</div>
            <h4>{company?.name}</h4>
            <Row>
              {company?.jobFields ? (
                <Space wrap>
                  {company?.jobFields?.map((jobField) => {
                    return <Tag color="orange">{jobField?.name}</Tag>
                  })}
                </Space>
              ) : (
                'Chưa có lĩnh vực'
              )}
            </Row>
            <br />
            <Card>
              <div>Địa điểm làm việc</div>
              <div>{company?.address}</div>
            </Card>
          </Card>
        </Col>
      </Row>
      <Divider>
        <strong>Việc làm tương tự</strong>
      </Divider>
      <Row
        gutter={[16, 16]}
        style={{
          width: '70%',
          justifyContent: 'space-between',
          marginBottom: '30px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {similarJobs.length > 0
          ? similarJobs?.map((item) => {
              return (
                <Col lg={24} key={item.id}>
                  <JobItem item={item} />
                </Col>
              )
            })
          : 'Không có'}
      </Row>
    </div>
  )
}

export default JobDetail
