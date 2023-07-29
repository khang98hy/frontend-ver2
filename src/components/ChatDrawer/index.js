/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { ArrowLeftOutlined, SendOutlined } from '@ant-design/icons'
import { Alert, Button, Col, Drawer, Input, Row } from 'antd'
import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import ScrollToBottom, { useScrollToBottom, useSticky } from 'react-scroll-to-bottom'
import MessageAPI from 'services/api/message.api'
import { css } from '@emotion/css'
import socket from '../../services/socket/socket'

const ROOT_CSS = css({
  height: '-webkit-fill-available',
  width: '100%',
})

const ChatDrawer = (props) => {
  const { open, setOpen, applicationJob } = props
  const { id } = useSelector((state) => state.user)
  const [content, setContent] = useState('')
  const [messageList, setMessageList] = useState([])
  const scrollToBottom = useScrollToBottom()
  const handleCancel = () => {
    setOpen(false)
    handleReadAllMessage(applicationJob?.id, id)
  }
  const handleSendMessage = async () => {
    if (content.trim()?.length > 0) {
      const payload = {
        content,
        user: {
          id,
        },
        applicationJob: {
          id: applicationJob?.id,
        },
      }
      const response = await MessageAPI.create(payload)
      if (response) {
        setMessageList([...messageList, response.data])
        socket.emit('send-message', {
          roomId: applicationJob?.roomId,
          message: content,
          senderId: id,
        })
      }
    }
  }

  const handleReadAllMessage = async (applicationJobId, userId) => {
    const response = await MessageAPI.readAll(applicationJobId, userId)
  }

  const fetchMessages = async (payload) => {
    const response = await MessageAPI.getAll(payload)
    if (response) {
      setMessageList(response.data)
    }
  }
  useEffect(() => {
    if (applicationJob) {
      const payload = {
        applicationJobId: applicationJob.id,
      }
      fetchMessages(payload)
    }
  }, [applicationJob])

  useEffect(() => {
    socket.on('receive-message', ({ message, senderId }) => {
      setMessageList([...messageList, { content: message, user: { id: senderId } }])
      scrollToBottom()
    })
  }, [messageList])
  useEffect(() => {
    if (applicationJob) {
      socket.emit('join-chat', { roomId: applicationJob?.roomId, userId: id })
    }
  }, [applicationJob, id])
  return (
    <Drawer
      open={open}
      onClose={handleCancel}
      width="50%"
      closeIcon={<ArrowLeftOutlined />}
      title={`${applicationJob?.job?.name} - ${applicationJob?.jobSeeker?.fullname}`}
      footer={
        <Row align="center" gutter={16} style={{ alignItems: 'center' }}>
          <Col span={22}>
            <Input.TextArea
              autoSize={{ minRows: 1, maxRows: 5 }}
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
              }}
            />
          </Col>
          <Col span={2}>
            <Button
              icon={<SendOutlined />}
              type="primary"
              onClick={() => {
                handleSendMessage()
                setContent('')
              }}
            />
          </Col>
        </Row>
      }
    >
      <ScrollToBottom className={ROOT_CSS}>
        {messageList?.map((message) => {
          if (id === message?.user.id) {
            return (
              <Row key={message?.id} justify="end">
                <div
                  style={{
                    backgroundColor: '#4b7cf3',
                    border: 'solid 1px #4b7cf3',
                    padding: '8px',
                    borderRadius: '25px',
                    maxWidth: '60%',
                    marginBottom: '10px',
                    color: '#fff',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {message?.content}
                  {/* <pre>{message?.content}</pre> */}
                </div>
              </Row>
            )
          }
          return (
            <Row key={message?.id}>
              <div
                style={{
                  backgroundColor: '#80808069',
                  border: 'solid 1px #80808069',
                  padding: '8px',
                  borderRadius: '25px',
                  maxWidth: '60%',
                  marginBottom: '10px',
                  whiteSpace: 'pre-line',
                }}
              >
                {message?.content}
                {/* <pre>{message?.content}</pre> */}
              </div>
            </Row>
          )
        })}
      </ScrollToBottom>
    </Drawer>
  )
}

export default ChatDrawer
