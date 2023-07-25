import React, { useEffect, useState } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react-pro'
import { cilUser, cilDoor } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const [name, setName] = useState('')

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

  const navigate = useNavigate()
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      await axios.delete(`https://api2.librarysmayuppentek.sch.id/logout/${refreshToken}`)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      navigate('/login')
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
        <CDropdownItem href="">
          <CIcon icon={cilUser} className="me-2" disabled />
          Hello, {name}
        </CDropdownItem>
        <CDropdownItem onClick={logout}>
          <CIcon icon={cilDoor} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
