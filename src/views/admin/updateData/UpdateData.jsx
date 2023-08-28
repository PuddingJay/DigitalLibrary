import React, { Suspense, useEffect, useState } from 'react'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import {
  CCard,
  CCardBody,
  CAlert,
  CSpinner,
  CFormInput,
  CInputGroup,
  CButton,
  CCol,
  CAvatar,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilToggleOff, cilToggleOn, cilCheckCircle, cilXCircle } from '@coreui/icons'
import './updateData.scss'

const UpdateData = () => {
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confPassword, setConfPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfPassword, setShowConfPassword] = useState(false)

  const [msg, setMsg] = useState(null)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword)
  }
  const toggleConfPasswordVisibility = () => {
    setShowConfPassword(!showConfPassword)
  }

  const getAdmin = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      const response = await axios.get(`http://localhost:3005/token/${refreshToken}`)
      const decoded = jwtDecode(response.data.accessToken)
      setId(decoded.adminId)
      setName(decoded.name)
      setUsername(decoded.username)
      console.log(decoded)
    } catch (err) {
      console.error(err)
    }
  }
  useEffect(() => {
    getAdmin()
  }, [])

  const handleUpdateAdmin = async (e) => {
    e.preventDefault()

    if (!name || !username) {
      // Handle the error here (e.g., show a message to the user)
      setShowErrorAlert(true)

      setTimeout(() => {
        setShowErrorAlert(false)
      }, 3000)
      setMsg('Name dan/atau username tidak boleh kosong')
      return
    }

    const adminId = id

    const updatedAdminData = {
      name: name,
      username: username,
      prevPassword: password,
      newPassword: newPassword,
      confirmNewPassword: confPassword,
    }
    console.log(updatedAdminData)

    try {
      await axios
        .put(`http://localhost:3005/admin-update/${adminId}`, updatedAdminData)
        .then((response) => {
          setShowSuccessAlert(true)

          setTimeout(() => {
            setShowSuccessAlert(false)
          }, 3000)
          setMsg(response.data.message)
          // console.log(response.data)
        })
    } catch (error) {
      setShowErrorAlert(true)

      setTimeout(() => {
        setShowErrorAlert(false)
      }, 3000)
      setMsg(error.response.data.message)
      // console.error(error.response.data)
    }
  }

  return (
    <Suspense fallback={<CSpinner color="primary" />}>
      {showSuccessAlert && (
        <CAlert color="success" className="d-flex align-items-center">
          <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
          <div>{msg}</div>
        </CAlert>
      )}
      {showErrorAlert && (
        <CAlert color="danger" className="d-flex align-items-center">
          <CIcon icon={cilXCircle} className="flex-shrink-0 me-2" width={24} height={24} />
          <div>{msg}</div>
        </CAlert>
      )}
      <CCard>
        <CCardBody>
          <div className="profileInfo">
            <CAvatar
              src={`https://ui-avatars.com/api/?name=${name ? name : undefined}&background=random`}
              size="xl"
            />
            <div className="name">
              <p>Nama Lengkap</p>
              <h2>{name}</h2>
            </div>
          </div>
          <form onSubmit={handleUpdateAdmin} className="updateData-form-container">
            <h4>Ubah Informasi</h4>
            <div className="formUpdate row g-3">
              <CCol md={8}>
                <label htmlFor="floatingNama"> Nama Lengkap </label>
                <CFormInput
                  className="rounded-1"
                  type="text"
                  id="floatingNama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </CCol>
              <CCol md={4}>
                <label htmlFor="floatingUsername"> Username </label>
                <CFormInput
                  className="rounded-1"
                  type="text"
                  id="floatingUsername"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </CCol>
              <CCol md={12}>
                <label htmlFor="floatingPassword"> Old Password </label>
                <CInputGroup>
                  <CFormInput
                    className="rounded-1"
                    type={showPassword ? 'text' : 'password'}
                    id="floatingPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <CButton
                    className="rounded-1"
                    type="button"
                    color="secondary"
                    variant="outline"
                    onClick={togglePasswordVisibility}
                  >
                    <CIcon icon={showPassword ? cilToggleOn : cilToggleOff} size="xl" />
                  </CButton>
                </CInputGroup>
              </CCol>
              <CCol md={12}>
                <label htmlFor="floatingNewPassword"> New Password </label>
                <CInputGroup>
                  <CFormInput
                    className="rounded-1"
                    type={showNewPassword ? 'text' : 'password'}
                    id="floatingNewPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <CButton
                    className="rounded-1"
                    type="button"
                    color="secondary"
                    variant="outline"
                    onClick={toggleNewPasswordVisibility}
                  >
                    <CIcon icon={showNewPassword ? cilToggleOn : cilToggleOff} size="xl" />
                  </CButton>
                </CInputGroup>
              </CCol>
              <CCol md={12}>
                <label htmlFor="floatingConfPassword"> Confirm New Password </label>
                <CInputGroup>
                  <CFormInput
                    className="rounded-1"
                    type={showConfPassword ? 'text' : 'password'}
                    id="floatingConfPassword"
                    value={confPassword}
                    onChange={(e) => setConfPassword(e.target.value)}
                  />
                  <CButton
                    className="rounded-1"
                    type="button"
                    color="secondary"
                    variant="outline"
                    onClick={toggleConfPasswordVisibility}
                  >
                    <CIcon icon={showConfPassword ? cilToggleOn : cilToggleOff} size="xl" />
                  </CButton>
                </CInputGroup>
              </CCol>
              <CCol md={12}>
                <button className="btnDaftar">Simpan Perubahan </button>
              </CCol>
            </div>
          </form>
        </CCardBody>
      </CCard>
    </Suspense>
  )
}
export default UpdateData
