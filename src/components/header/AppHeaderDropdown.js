import React, { useEffect, useState } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react-pro'
import { cilUser, cilDoor, cilSettings, cilSmilePlus, cilColorBorder } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { Link } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const [name, setName] = useState('')
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      const response = await axios.get(
        `https://api2.librarysmayuppentek.sch.id/token/${refreshToken}`,
      )
      const decoded = jwtDecode(response.data.accessToken)
      setName(decoded.name)
      console.log(decoded)
    } catch (error) {
      console.error(error)
    }
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      await axios.delete(`https://api2.librarysmayuppentek.sch.id/logout/${refreshToken}`)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/login'
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar
          src={`https://ui-avatars.com/api/?name=${name ? name : undefined}&background=random`}
          size="md"
          status="success"
        />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold py-2 rounded-top">
          Account
        </CDropdownHeader>
        <CDropdownItem>
          <CIcon icon={cilUser} className="me-2" disabled />
          Halo, {name}
        </CDropdownItem>
        <Link to="/updateData" style={{ textDecoration: 'none' }}>
          <CDropdownItem component="span">
            <CIcon icon={cilSettings} className="me-2" disabled />
            Ubah Informasi Akun
          </CDropdownItem>
        </Link>
        <CDropdownHeader className="bg-body-secondary fw-semibold py-2">Form</CDropdownHeader>
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <CDropdownItem component="span">
            <CIcon icon={cilSmilePlus} className="me-2" disabled />
            Form Daftar Admin
          </CDropdownItem>
        </Link>
        <Link to="/form-pengunjung" style={{ textDecoration: 'none' }}>
          <CDropdownItem component="span">
            <CIcon icon={cilColorBorder} className="me-2" disabled />
            Form Pengunjung
          </CDropdownItem>
        </Link>
        <CDropdownDivider />
        <CDropdownItem
          onClick={logout}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ cursor: hovered ? 'pointer' : 'default' }}
        >
          <CIcon icon={cilDoor} className="me-2" />
          Keluar
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
