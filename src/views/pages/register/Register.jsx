import React, { useEffect, useState } from 'react'
import { CFormInput, CInputGroup, CButton } from '@coreui/react-pro'
import { Link } from 'react-router-dom'
import './register.scss'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import CIcon from '@coreui/icons-react'
import { cilToggleOff, cilToggleOn } from '@coreui/icons'

const Register = () => {
  const [nama, setNama] = useState(null)
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const [confPassword, setConfPassword] = useState(null)
  const [msg, setMsg] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfPassword, setShowConfPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const toggleConfPasswordVisibility = () => {
    setShowConfPassword(!showConfPassword)
  }

  useEffect(() => {
    auth()
    RefreshToken()
  })

  const auth = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('Refresh token not found')
      }

      const response = await axios.get(
        `https://api2.librarysmayuppentek.sch.id/token/${refreshToken}`,
      )
      localStorage.setItem('refreshToken', refreshToken)
      const decoded = jwtDecode(response.data.accessToken)

      console.log(decoded)
    } catch (err) {
      if (
        err.message === 'Refresh token not found' ||
        (err.response && err.response.status === 403)
      ) {
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
      } else if (err.response && err.response.status === 401) {
        window.location.href = '/login'
      }
      console.log(err)
    } finally {
      try {
        const refreshTokenSiswa = localStorage.getItem('refreshTokenSiswa')
        await axios.delete(
          `https://api2.librarysmayuppentek.sch.id/siswaLogout/${refreshTokenSiswa}`,
        )
      } catch (err) {
        console.log(err.message)
      }
    }
  }

  const RefreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      const response = await axios.get(
        `https://api2.librarysmayuppentek.sch.id/token/${refreshToken}`,
      )
      const decoded = jwtDecode(response.data.accessToken)

      if (decoded.role !== 'superadmin') {
        window.location.href = '/dashboard'
        alert('Anda tidak punya akses untuk halaman ini')
      }
    } catch (err) {
      console.error(err)
      if (err.response && err.response.status === 404) {
        window.location.href = '/login'
      }
    }
  }

  const Regis = async (e) => {
    e.preventDefault()

    try {
      await axios.post('https://api2.librarysmayuppentek.sch.id/admin', {
        nama: nama,
        username: username,
        password: password,
        confPassword: confPassword,
      })

      window.location.href = '/login'
      alert('Register Berhasil')
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.message)
      }
      if (!nama || !username || !password || !confPassword) {
        setMsg('All fields are required.')
      }
      if (password !== confPassword) {
        setMsg('Passwords do not match.')
      }
      console.log(error)
    }
  }

  return (
    <div className="register">
      <div className="cardLogin">
        <div className="left">
          <div className="greeter">
            <h1>Silahkan Daftar</h1>
            <div className="divider"></div>
            <p>Digital Library SMA Yuppentek 1 Kota Tangerang</p>
          </div>
          <div className="toLoginLaptop">
            <span>Sudah Memiliki Akun?</span>
            <Link to="/login">
              <button>Masuk Disini</button>
            </Link>
          </div>
        </div>

        <div className="right">
          <div className="logo">
            <img src="/images/logoSMA.png" alt="" />
            <p>SMA Yuppentek 1 Kota Tangerang</p>
          </div>
          <form onSubmit={Regis} className="loginContainer">
            <h1>Register</h1>
            <div className="formLogin">
              <CFormInput
                type="text"
                id="floatingNama"
                floatingLabel="Nama"
                placeholder="Nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
              <CFormInput
                type="text"
                id="floatingUsername"
                floatingLabel="Username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <CInputGroup>
                <CFormInput
                  type={showPassword ? 'text' : 'password'}
                  id="floatingPassword"
                  floatingLabel="Password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <CButton
                  type="button"
                  color="secondary"
                  variant="outline"
                  onClick={togglePasswordVisibility}
                >
                  <CIcon icon={showPassword ? cilToggleOn : cilToggleOff} size="xl" />
                </CButton>
              </CInputGroup>
              <CInputGroup>
                <CFormInput
                  type={showConfPassword ? 'text' : 'password'}
                  id="floatingConfPassword"
                  floatingLabel="Confirm Password"
                  placeholder="Confirm Password"
                  value={confPassword}
                  onChange={(e) => setConfPassword(e.target.value)}
                />
                <CButton
                  type="button"
                  color="secondary"
                  variant="outline"
                  onClick={toggleConfPasswordVisibility}
                >
                  <CIcon icon={showConfPassword ? cilToggleOn : cilToggleOff} size="xl" />
                </CButton>
              </CInputGroup>
              <button className="btnDaftar">Daftar </button>
            </div>
            <div className="toRegister">
              <span>Sudah Memiliki Akun?</span>
              <Link to="/login">
                <span>Masuk Disini</span>
              </Link>
            </div>
            <p>{msg}</p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
