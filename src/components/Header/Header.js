import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'

const Header = ({ Jsx }) => {
  return (
    <Navbar variant="ligth">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Jsx />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
