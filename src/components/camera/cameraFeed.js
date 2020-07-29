import React, { Fragment, useCallback, useState, useEffect, useRef } from 'react'
import { Button } from 'react-bootstrap'
import styled from 'styled-components'
import { Navbar, Nav } from 'react-bootstrap'

const LgDiv = styled.div`
  &:media (min-width: 992px) {
    flex: 0 0 50%;
    max-width: 50%;
  }
`
const SmDiv = styled.div`
  &:media (min-width: 992px) {
    flex: 0 0 50%;
    max-width: 50%;
  }
`

const Buttons = styled.div`
  margin: 50px 500px 0 500px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MyButton = styled(Button)`
  width: 120px;
  height: 50px;
`


const CameraFeed = () => {
  const [filter, setFilter] = useState(null)
  const videoPlayer = useRef(null)
  const canvas = useRef(null)

  const processDevices = useCallback((devices) => {
    devices.forEach(device => {
      console.log('Device:', device.label)
      setDevice(device)
    })
  })

  useEffect(() => {
    console.log(navigator.mediaDevices.enumerateDevices())
    async function getCamera() {
      console.log('enumerate devices:', navigator.mediaDevices.enumerateDevices())
      const cameras = await navigator.mediaDevices.enumerateDevices()
      processDevices(cameras)
    }
    getCamera()
  }, [processDevices])



  const setDevice = async (device) => {
    const { deviceId } = device
    const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { deviceId } })
      .then(stream => videoPlayer.current.srcObject = stream)
      .catch(err => console.log(err))
    videoPlayer.current.play()
  }

  const turnCameraOff = () => {
    videoPlayer.current.srcObject.getVideoTracks().forEach(track => track.stop())
  }

  const turnCameraOn = async () => {
    const cameras = await navigator.mediaDevices.enumerateDevices()
    processDevices(cameras)
  }

  const takePhoto = () => {
    const context = canvas.current.getContext('2d')
    context.drawImage(videoPlayer.current, 0, 0, canvas.current.width, canvas.current.height)
  }

  const savePhoto = () => {
  canvas.current.toBlob(
    blob => {
      const anchor = document.createElement('a')
      anchor.download = 'my-file-name.jpg'
      anchor.href = URL.createObjectURL(blob)
      anchor.click()
      URL.revokeObjectURL(anchor.href)
    },
    'image/jpeg',
    0.9,
  )
}

  return (
    <Fragment>
        <Navbar bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Button variant='dark' className='mr-2' onClick={() => turnCameraOn()}>Turn on Camera</Button>
              <Button variant='dark' className='mr-2' onClick={() => turnCameraOff()}>Turn off Camera</Button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      <div className="row">
        <LgDiv className="col-lg-6">
          <video ref={videoPlayer} width="1020"/>
        </LgDiv>
        <SmDiv className="col-lg-4">
          <canvas className='canvas' style={{filter: filter}} width="1020" height="575" ref={canvas} />
        </SmDiv>
      </div>
      <Buttons>
        <MyButton variant='dark' onClick={() => takePhoto()}>Take photo!</MyButton>
        <MyButton variant='info' onClick={() => setFilter(null)}>Normal</MyButton>
        <MyButton variant='info' onClick={() => setFilter("grayscale(1)")}>Greyscale</MyButton>
        <MyButton variant='info' onClick={() => setFilter("sepia(1)")}>Sepia</MyButton>
        <MyButton variant='info' onClick={() => setFilter("saturate(8)")}>Saturate</MyButton>
        <MyButton variant='info' onClick={() => setFilter("saturate(1.5) contrast(1.3) blur(0.2px) brightness(1.1)")}>Lomo</MyButton>
        <MyButton variant='info' onClick={() => setFilter("blur(5px) opacity(0.6)")}>blur</MyButton>
        <MyButton onClick={(e) => savePhoto(e)}>Save photo!</MyButton>
      </Buttons>
    </Fragment>
  )
}

export default CameraFeed
