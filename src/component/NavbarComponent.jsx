/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import logo from '../assets/logoSMA.png'
import {
  CImage, CContainer, CNavbar, CNavbarBrand, CNavbarToggler, CNavItem, CNavLink,
  CCollapse, CNavbarNav, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem
} from '@coreui/react'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
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

  return (
    <>
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
