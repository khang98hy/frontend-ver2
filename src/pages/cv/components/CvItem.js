/* eslint-disable no-unused-vars */
import { DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row } from 'antd'
import React from 'react'
import moment from 'moment'
import { getCV } from 'util/helper'
import CvAPI from 'services/api/cv.api'
import { showErrorMessage, showSuccessMessage } from 'util/notification'
import FileSaver from 'file-saver'
import { useDispatch } from 'react-redux'
import cvActions from '../reducers/actions'

const CvItem = (props) => {
  const { item } = props
  const dispatch = useDispatch()
  const handleDownload = (url, name) => {
    FileSaver.saveAs(url, name)
  }
  const handleDelete = async (id) => {
    try {
      const response = await CvAPI.delete(id)
      if (response) {
        showSuccessMessage('Xóa CV thành công')
        dispatch({
          type: cvActions.SET_STATE,
          payload: {
            reloadData: Math.random(),
          },
        })
      }
    } catch (error) {
      showErrorMessage('Xóa CV thất bại')
    }
  }

  return (
    <Card hoverable>
      <Row>
        <Col span={20}>
          <h4 style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item?.name}</h4>
        </Col>
        <Col span={4} style={{ textAlign: 'end' }}>
          <Button
            icon={<EditOutlined />}
            shape="circle"
            onClick={() => {
              dispatch({
                type: cvActions.SET_STATE,
                payload: {
                  openForm: true,
                  selectedCv: item,
                },
              })
            }}
          />
        </Col>
      </Row>
      <Row>Câp nhật lần cuối {moment(item?.lastModifiedDate).format('DD-MM-YYYY HH:mm')}</Row>
      <br />
      <Row gutter={12}>
        <Col lg={10}>
          <Button icon={<EyeOutlined />} shape="round" href={getCV(item?.cvUrl)} target="_blank">
            Xem CV
          </Button>
        </Col>
        <Col lg={10}>
          <Button
            icon={<DownloadOutlined />}
            shape="round"
            onClick={() => {
              handleDownload(getCV(item?.cvUrl), item?.name)
            }}
          >
            Tải xuống
          </Button>
        </Col>
        <Col lg={4} style={{ textAlign: 'center' }}>
          <Button
            icon={<DeleteOutlined />}
            shape="circle"
            onClick={() => {
              handleDelete(item?.id)
            }}
          />
        </Col>
      </Row>
    </Card>
  )
}

export default CvItem
