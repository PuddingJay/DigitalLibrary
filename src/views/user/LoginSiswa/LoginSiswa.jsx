import React, { useState } from 'react'
import './login.scss'
import logo from '../../../assets/logoSMA.png'
import { CFormInput } from '@coreui/react-pro'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

// eslint-disable-next-line react/prop-types
const Login = () => {
  const [Nama, setNama] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const Auth = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3005/siswa/login', {
        Nama: Nama,
        password: password,
      })

      const { accessToken, refreshToken } = response.data
      // Store the accessToken and refreshToken in localStorage
      localStorage.setItem('accessTokenSiswa', accessToken)
      localStorage.setItem('refreshTokenSiswa', refreshToken)

      navigate('/Home')
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.message)
      }
    }
  }
  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword)
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
                floatingLabel="Nama"
                placeholder="Nama"
                value={Nama}
                onChange={(e) => setNama(e.target.value)}
              />
              <div className="password-container">
                <CFormInput
                  type={showPassword ? 'text' : 'password'}
                  id="floatingPassword"
                  floatingLabel="Password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="password-toggle" onClick={toggleShowPassword}>
                  {showPassword ? 'Hide' : 'Show'} Password
                </span>
              </div>
              <button>Masuk </button>
            </div>

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
