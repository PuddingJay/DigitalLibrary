/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import logo from '../../assets/logoSMA.png'
import {
  CImage, CContainer, CNavbar, CNavbarBrand, CNavbarToggler, CCollapse,
  CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDoor, cilUser, cilHome } from '@coreui/icons'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import './NavbarComponent.scss'
import { Link } from 'react-router-dom';

const NavbarComponent = () => {
  const [Nama, setNama] = useState('')
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshTokenSiswa')

      if (!refreshToken) {
        throw new Error('Refresh token siswa not found')
      }

      const response = await axios.get(
        `http://localhost:3005/berhasilLogin/${refreshToken}`,
      )
      const decoded = jwtDecode(response.data.accessToken)
      setNama(decoded.Nama)

      const oneDayInMilliseconds = 24 * 60 * 60 * 1000
      const tokenExpirationTime = decoded.exp * 1000
      const currentTime = Date.now()
      if (currentTime > tokenExpirationTime + oneDayInMilliseconds) {
        localStorage.removeItem('refreshToken')
        throw new Error('Refresh token has expired')
      }

      console.log(decoded)
    } catch (err) {
      if (
        err.message === 'Refresh token siswa not found' ||
        err.message === 'Refresh token has expired' ||
        (err.response && err.response.status === 403)
      ) {
        window.location.href = '/siswa/login'
      } else if (err.response && err.response.status === 401) {
        window.location.href = '/siswa/login'
      } else if (err.response && err.response.status === 403) {
        localStorage.removeItem('refreshToken')
        window.location.href = '/siswa/login'
      }
      console.log(err)
    }
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshTokenSiswa')
      await axios.delete(`http://localhost:3005/siswaLogout/${refreshToken}`)
      localStorage.removeItem('accessTokenSiswa')
      localStorage.removeItem('refreshTokenSiswa')
      window.location.href = '/siswa/login'
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
              <CDropdown variant="nav-item" popper={true} className="nav-dropdown">
                <CDropdownToggle>Selamat datang {Nama}</CDropdownToggle>
                <CDropdownMenu>
                  <Link to="/Home" style={{ textDecoration: 'none' }}>
                    <CDropdownItem component='span'>
                      <CIcon icon={cilHome} className="me-2" disabled />
                      Home
                    </CDropdownItem>
                  </Link>
                  <Link to="/updateSiswa" style={{ textDecoration: 'none' }}>
                    <CDropdownItem component='span'>
                      <CIcon icon={cilUser} className="me-2" disabled />
                      Profil
                    </CDropdownItem>
                  </Link>
                  <CDropdownDivider />
                  <CDropdownItem onClick={logout} onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    style={{ cursor: hovered ? 'pointer' : 'default' }}>
                    <CIcon icon={cilDoor} className="me-2" />
                    Keluar</CDropdownItem>
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
