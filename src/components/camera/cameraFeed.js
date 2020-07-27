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



const CameraFeed = () => {
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

  return (
    <Fragment>
        <Navbar bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
            <Button variant='dark' className='mr-2' onClick={() => turnCameraOn()}>Turn on Camera</Button>
            <Button variant='dark' className='mr-2' onClick={() => turnCameraOff()}>Turn off Camera</Button>
            <Button variant='dark' onClick={() => takePhoto()}>Take photo!</Button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      <div className="row">
        <LgDiv className="col-lg-6">
          <video ref={videoPlayer} width="1020"/>
        </LgDiv>
        <SmDiv className="col-lg-4">
          <canvas className='canvas' width="1020" height="575" ref={canvas} />
        </SmDiv>
      </div>
    </Fragment>
  )
}

export default CameraFeed
