/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
// import Button from 'react-bootstrap/Button'
// import Container from 'react-bootstrap/Container'
import logo from '../assets/logoSMA.png'
// import Navbar from 'react-bootstrap/Navbar'
import { CNavbar } from '@coreui/react'
import { CContainer } from '@coreui/react'
import { CImage } from '@coreui/react'
import {
  CNavbarBrand,
  CNavbarToggler,
  CNavItem,
  CNavLink,
  CForm,
  CFormInput,
  CButton,
} from '@coreui/react'
import { CCollapse } from '@coreui/react'
import { CNavbarNav } from '@coreui/react'
import { CDropdown } from '@coreui/react'
import { CDropdownToggle } from '@coreui/react'
import { CDropdownMenu } from '@coreui/react'
import { CDropdownItem } from '@coreui/react'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
// import NavDropdown from 'react-bootstrap/NavDropdown'
import './NavbarComponent.scss'

const NavbarComponent = () => {
  const [Nama, setNama] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3005/berhasilLogin')
      const decoded = jwtDecode(response.data.accessToken)
      setNama(decoded.Nama)
      console.log(decoded)
    } catch (error) {
      console.error(error)
    }
  }

  const logout = async () => {
    try {
      await axios.delete('http://localhost:3005/siswa/logout')
      navigate('/siswa/login')
    } catch (err) {
      console.log(err)
    }
  }
  const [visible, setVisible] = useState(false)
  // return (
  //   <Navbar className="bg-body-tertiary">
  //     <Container>
  //       <Navbar.Brand href="#home">
  //         <img src={logo} alt="" style={{ width: '50px' }} />
  //         <span style={{ marginLeft: '10px', color: 'white' }}>SMA YUPPENTEK 1</span>
  //       </Navbar.Brand>
  //       <Navbar.Toggle />
  //       <Navbar.Collapse className="justify-content-end">
  //         <NavDropdown
  //           title={<span style={{ color: 'white' }}>Halo Ahmad</span>}
  //           id="basic-nav-dropdown"
  //         >
  //           <NavDropdown.Item href="#Login">Keluar</NavDropdown.Item>
  //         </NavDropdown>
  //         {/* <Navbar.Text>
  //           Signed in as: <a href="#login">Mark Otto</a>
  //         </Navbar.Text> */}
  //       </Navbar.Collapse>
  //     </Container>
  //   </Navbar>
  // )

  return (
    <>
      {/* <div className="navbar-component">
        
        <CNavbar expand="lg" color="primary" className="bg-dark">
          <CContainer fluid>
            <CNavbarBrand href="#">
              <CImage rounded src={logo} alt="" style={{ width: '50px' }} />
              <span style={{ marginLeft: '10px', color: 'white' }}>SMA YUPPENTEK 1 Tangerang</span>
            </CNavbarBrand>

            <CCollapse className="navbar-collapse justify-content-end">
              <CNavbarNav>
                {/* <CNavItem>
  
                <CNavLink href="#" active>
  
                  Home
  
                </CNavLink>
  
              </CNavItem>
  
              <CNavItem>
  
                <CNavLink href="#">Link</CNavLink>
  
              </CNavItem> */}
      {/* <CDropdown variant="nav-item" popper={false}>
                  <CDropdownToggle className="d-lg-none">Selamat datang {Nama}</CDropdownToggle>

                  <CDropdownMenu className="d-lg-none">
                    <CDropdownItem onClick={logout}>Keluar</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown> */}
      {/* <CNavItem>
                <CNavLink href="#" disabled>
                  Disabled
                </CNavLink>
              </CNavItem> */}
      {/* </CNavbarNav> */}
      {/* <CForm className="d-flex">
              <CFormInput type="search" className="me-2" placeholder="Search" />

              <CButton type="submit" color="success" variant="outline">
                Search
              </CButton>
            </CForm> */}
      {/* //       </CCollapse> */}
      {/* //     </CContainer> */}
      {/* //   </CNavbar> */}
      {/* // </div> */}
      <CNavbar expand="lg" color="primary" className="bg-dark">
        <CContainer fluid>
          <CNavbarToggler
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          <CCollapse className="navbar-collapse" visible={visible}>
            <CNavbarBrand href="#">
              <CImage rounded src={logo} alt="" style={{ width: '50px' }} />
              <span style={{ marginLeft: '10px', color: 'white' }}>SMA YUPPENTEK 1 Tangerang</span>
            </CNavbarBrand>
            <CNavbarNav className="me-auto mb-2 mb-lg-0">
              <CNavItem>
                <CNavLink href="#" active></CNavLink>
              </CNavItem>
              <CNavItem></CNavItem>
              <CNavItem></CNavItem>
            </CNavbarNav>
            <CDropdown variant="nav-item" popper={false}>
              <CDropdownToggle>Selamat datang {Nama}</CDropdownToggle>

              <CDropdownMenu>
                <CDropdownItem onClick={logout}>Keluar</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CCollapse>
        </CContainer>
      </CNavbar>
    </>
  )
}

export default NavbarComponent
