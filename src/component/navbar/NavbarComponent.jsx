/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import logo from '../../assets/logoSMA.png'
import {
  CImage, CContainer, CNavbar, CNavbarBrand, CNavbarToggler, CCollapse,
  CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem
} from '@coreui/react'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './NavbarComponent.scss'

const NavbarComponent = () => {
  const [Nama, setNama] = useState('')
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3005/berhasilLogin')
      const decoded = jwtDecode(response.data.accessToken)
      setNama(decoded.Nama)
      console.log(decoded)
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/siswa/login')
      }
      console.log(err.message)
    }
  }

  const logout = async () => {
    try {
      await axios.delete('http://localhost:3005/siswaLogout')
      navigate('/siswa/login')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <CNavbar expand="lg" className="navBar">
        <CContainer fluid>
          <div className="navContainer">
            <div className="navPositionHandler">
              {/* <div className="spaceAround"> */}
              <CNavbarBrand href="/Home" className="logoSekolah">
                <CImage rounded src={logo} alt="logo SMA Yuppentek 1 Kota Tangerang" />
                <span>SMA YUPPENTEK 1</span>
              </CNavbarBrand>
              <CNavbarToggler
                aria-label="Toggle navigation"
                aria-expanded={visible}
                onClick={() => setVisible(!visible)}
                style={{ backgroundColor: '#29266a' }}
                className="navbar-dark"
              />
              {/* </div> */}
            </div>
            <CCollapse className="navbar-collapse" visible={visible}>
              <CDropdown variant="nav-item" popper={false} className="nav-dropdown">
                <CDropdownToggle>Selamat datang {Nama}</CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem onClick={logout}>Keluar</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CCollapse>
          </div>
        </CContainer>
      </CNavbar>
      <div className="barBiru"></div>
    </>
  )
}

export default NavbarComponent
