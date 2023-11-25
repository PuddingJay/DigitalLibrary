import React, { useState } from 'react'
import './login.scss'
// import { Link } from 'react-router-dom';
import logo from '../../../assets/logoSMA.png'
import { CFormInput, CInputGroup, CButton } from '@coreui/react-pro'
import axios from 'axios'
import { Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilToggleOff, cilToggleOn } from '@coreui/icons'

// eslint-disable-next-line react/prop-types
const Login = ({ loginSuccess }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const Auth = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('https://api2.librarysmayuppentek.sch.id/login', {
        username: username,
        password: password,
      })

      const { accessToken, refreshToken } = response.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      window.location.href = '/dashboard'
      loginSuccess(response)
    } catch (error) {
      if (error.response) {
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
            <h1>Login</h1>
            <div className="formLogin">
              <CFormInput
                type="text"
                id="floatingInput"
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
              <button className="btnMasuk">Masuk</button>
            </div>
            <Link to="/siswa/login">Masuk sebagai Siswa</Link>
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
