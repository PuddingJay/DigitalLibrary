import React, { Suspense, useEffect, useState } from 'react'
import { NavbarComponent } from 'src/component/index'
import {
  CCard,
  CCardBody,
  CAlert,
  CSpinner,
  CFormInput,
  CInputGroup,
  CButton,
  CAvatar,
  CForm,
  CImage,
  CFooter,
  CLink,
} from '@coreui/react-pro'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import './updateSiswa.scss'
import CIcon from '@coreui/icons-react'
import { cilToggleOff, cilToggleOn, cilCheckCircle, cilXCircle } from '@coreui/icons'

const UpdateSiswa = () => {
  const [id, setId] = useState('')
  const [nama, setNama] = useState('')
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

  useEffect(() => {
    getSiswa()
  }, [])

  const getSiswa = async () => {
    try {
      const refreshTokenSiswa = localStorage.getItem('refreshTokenSiswa')
      const response = await axios.get(`http://localhost:3005/berhasilLogin/${refreshTokenSiswa}`)
      const decoded = jwtDecode(response.data.accessToken)
      console.log(decoded)
      setNama(decoded.Nama)
      setId(decoded.siswaId)
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    const siswaId = id

    const updatePasswordData = {
      prevPassword: password,
      newPassword: newPassword,
      confirmNewPassword: confPassword,
    }
    console.log(updatePasswordData)

    try {
      const response = await axios.put(
        `http://localhost:3005/siswa-update/${siswaId}`,
        updatePasswordData,
      )
      setShowSuccessAlert(true)
      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)
      setMsg(response.data.message)
    } catch (err) {
      setShowErrorAlert(true)

      setTimeout(() => {
        setShowErrorAlert(false)
      }, 3000)
      setMsg(err.response.data.message)
    }
  }
  return (
    <Suspense fallback={<CSpinner color="primary" />}>
      <NavbarComponent />
      <CCard>
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
        <CCardBody>
          <div className="profileSiswa">
            <CAvatar
              src={`https://ui-avatars.com/api/?name=${nama ? nama : undefined}&background=random`}
              size="xl"
            />
            <div className="name">
              <p>User</p>
              <h2>{nama}</h2>
            </div>
          </div>
          <CForm onSubmit={handleUpdate} className="form-updateSiswa">
            <h4>Form Ubah Password</h4>
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
            <button className="btnDaftar">Simpan Perubahan </button>
          </CForm>
        </CCardBody>
      </CCard>
      <CFooter>
        <CImage className="logo" rounded src="/images/logouper.png" />
        <div style={{ fontFamily: 'Poppins' }}>
          <span className="ms-1"> Copyright &copy; 2023 Pengabdian Kepada Masyarakat</span>
          <CLink href="https://universitaspertamina.ac.id/" target="_blank" rel="noreferrer">
            Universitas Pertamina
          </CLink>
        </div>
      </CFooter>
    </Suspense>
  )
}

export default UpdateSiswa
