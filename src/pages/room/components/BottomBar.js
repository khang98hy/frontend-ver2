/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Affix, Col, Row } from 'antd'
import Column from 'antd/lib/table/Column'
import React, { useCallback } from 'react'
import styled from 'styled-components'

const BottomBar = ({
  clickChat,
  clickCameraDevice,
  goToBack,
  toggleCameraAudio,
  userVideoAudio,
  clickScreenSharing,
  screenShare,
  videoDevices,
  showVideoDevices,
  setShowVideoDevices,
}) => {
  const handleToggle = useCallback(
    (e) => {
      setShowVideoDevices((state) => !state)
    },
    [setShowVideoDevices],
  )

  return (
    // <Affix offsetBottom={0}>
    <Bar>
      <Left>
        <CameraButton onClick={toggleCameraAudio} data-switch="video">
          <div>
            {userVideoAudio.video ? (
              <FaIcon className="fas fa-video" />
            ) : (
              <FaIcon className="fas fa-video-slash" />
            )}
          </div>
          Camera
        </CameraButton>
        <CameraButton onClick={toggleCameraAudio} data-switch="audio">
          <div>
            {userVideoAudio.audio ? (
              <FaIcon className="fas fa-microphone" />
            ) : (
              <FaIcon className="fas fa-microphone-slash" />
            )}
          </div>
          Audio
        </CameraButton>
      </Left>
      <Center>
        {/* <ChatButton onClick={clickChat}>
          <div>
            <FaIcon className="fas fa-comments" />
          </div>
          Chat
        </ChatButton> */}
        <ScreenButton onClick={clickScreenSharing}>
          <div>
            <FaIcon className={`fas fa-desktop ${screenShare ? 'sharing' : ''}`} />
          </div>
          Share Screen
        </ScreenButton>
      </Center>
      <Right>
        <StopButton onClick={goToBack}>Stop</StopButton>
      </Right>
    </Bar>
    // {/* </Affix> */}
  )
}

const Bar = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 8%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  background-color: #4ea1d3;
`
const Left = styled.div`
  display: flex;
  align-items: center;

  margin-left: 15px;
`

const Center = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`

const Right = styled.div``

const ChatButton = styled.div`
  width: 75px;
  border: none;
  font-size: 0.9375rem;
  padding: 5px;
  cursor: pointer;
  text-align: center;
  :hover {
    background-color: #77b7dd;
    cursor: pointer;
    border-radius: 15px;
  }

  * {
    pointer-events: none;
  }
`

const ScreenButton = styled.div`
  width: auto;
  border: none;
  font-size: 0.9375rem;
  padding: 5px;
  text-align: center;
  cursor:pointer;
  :hover {
    background-color: #77b7dd;
    cursor: pointer;
    border-radius: 15px;
  }

  .sharing {
    color: #ee2560;
  }
`

const FaIcon = styled.i`
  width: 30px;
  font-size: calc(16px + 1vmin);
`

const StopButton = styled.div`
  width: 75px;
  height: 30px;
  border: none;
  font-size: 0.9375rem;
  line-height: 30px;
  margin-right: 15px;
  background-color: #ee2560;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  :hover {
    background-color: #f25483;
    cursor: pointer;
  }
`

const CameraButton = styled.div`
  position: relative;
  width: 75px;
  border: none;
  font-size: 0.9375rem;
  padding: 5px;
  cursor: pointer;
  text-align: center;
  :hover {
    background-color: #77b7dd;
    cursor: pointer;
    border-radius: 15px;
  }

  * {
    pointer-events: none;
  }

  .fa-microphone-slash {
    color: #ee2560;
  }

  .fa-video-slash {
    color: #ee2560;
  }
`

const SwitchMenu = styled.div`
  display: flex;
  position: absolute;
  width: 20px;
  top: 7px;
  left: 80px;
  z-index: 1;

  :hover {
    background-color: #476d84;
    cursor: pointer;
    border-radius: 15px;
  }

  * {
    pointer-events: none;
  }

  > i {
    width: 90%;
    font-size: calc(10px + 1vmin);
  }
`

const SwitchList = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: -65.95px;
  left: 80px;
  background-color: #4ea1d3;
  color: white;
  padding-top: 5px;
  padding-right: 10px;
  padding-bottom: 5px;
  padding-left: 10px;
  text-align: left;

  > div {
    font-size: 0.85rem;
    padding: 1px;
    margin-bottom: 5px;

    :not(:last-child):hover {
      background-color: #77b7dd;
      cursor: pointer;
    }
  }

  > div:last-child {
    border-top: 1px solid white;
    cursor: context-menu !important;
  }
`

export default BottomBar
