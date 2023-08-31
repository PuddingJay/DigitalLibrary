import React, { useState } from 'react'
import './login.scss'
import logo from '../../../assets/logoSMA.png'
import { CFormInput, CInputGroup, CButton } from '@coreui/react-pro'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilToggleOff, cilToggleOn } from '@coreui/icons'

// eslint-disable-next-line react/prop-types
const Login = () => {
  const [nama, setnama] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const convertToFullName = (input) => {
    const spacedInput = input.replace(/([a-z])([A-Z])/g, '$1 $2')

    const words = spacedInput.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/)
    return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const Auth = async (e) => {
    e.preventDefault()
    const formattednama = convertToFullName(nama)

    try {
      const response = await axios.post('http://localhost:3005/siswa/login', {
        nama: formattednama,
        password: password,
      })

      const { accessToken, refreshToken } = response.data
      localStorage.setItem('accessTokenSiswa', accessToken)
      localStorage.setItem('refreshTokenSiswa', refreshToken)

      window.location.href = '/Home'
    } catch (error) {
      if (error.response) {
        console.log(formattednama)
        console.log(nama)
        console.log(error)
        setMsg(error.response.data.message)
      }
    }
  }
  return (
    <div className="login">
      <div className="cardLogin">
        <div className="left">
          <div className="greeter">
            <h1>Selamat Datang</h1>
            <div className="divider"></div>
            <p>Digital Library SMA Yuppentek 1 Kota Tangerang</p>
          </div>
        </div>

        <div className="right">
          <div className="logo">
            <img src={logo} alt="" />
            <p>SMA Yuppentek 1 Kota Tangerang</p>
          </div>
          <form onSubmit={Auth} className="loginContainer">
            <h1>Login Siswa</h1>
            <div className="formLogin">
              <CFormInput
                type="text"
                id="floatingInput"
                floatingLabel="nama"
                placeholder="nama"
                value={nama}
                onChange={(e) => setnama(e.target.value)}
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
              <button className="btnMasuk">Masuk </button>
            </div>
            <a href="/login">Masuk sebagai Admin</a>
            <p>{msg}</p>
            <a
              className="uper"
              href="https://universitaspertamina.ac.id/"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/images/logouper.png" alt="" />
            </a>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
