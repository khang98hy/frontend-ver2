/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row } from 'antd'
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'services/ultis/constants'
import CvAPI from 'services/api/cv.api'
import CvForm from './components/CvForm'
import cvActions from './reducers/actions'
import CvItem from './components/CvItem'

const CVPage = () => {
  const dispatch = useDispatch()
  const { reloadData } = useSelector((state) => state.cv)
  const [cvList, setCvList] = useState([])
  const { jobSeekerId } = useSelector((state) => state.user)
  const [pagination, setPagination] = useState({
    current: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  })

  const fetchCvs = async (payload) => {
    const response = await CvAPI.search(payload)
    if (response) {
      setCvList(response.data.content)
      setPagination({ ...pagination, total: response.data.totalElements })
    }
  }
  useEffect(() => {
    const payload = {
      page: pagination.current - 1,
      size: pagination.pageSize,
      'jobSeekerId.equals': jobSeekerId,
      sort: 'lastModifiedDate,desc',
    }
    fetchCvs(payload)
  }, [pagination.current, reloadData])

  return (
    <div>
      <Helmet title="Hồ sơ & CV" />
      <CvForm />
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
        <Card
          title="CV đã tạo"
          style={{ width: '100%' }}
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                dispatch({
                  type: cvActions.SET_STATE,
                  payload: {
                    openForm: true,
                  },
                })
              }}
            >
              Thêm CV
            </Button>
          }
        >
          <Row gutter={[16, 16]}>
            {cvList?.map((item) => {
              return (
                <Col lg={8} key={item.id}>
                  <CvItem item={item} />
                </Col>
              )
            })}
          </Row>
        </Card>
      </Row>
    </div>
  )
}

export default CVPage
