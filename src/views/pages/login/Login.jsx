import React, { useState } from 'react'
import './login.scss'
// import { Link } from 'react-router-dom';
import logo from '../../../assets/logoSMA.png'
import { CFormInput } from '@coreui/react-pro'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

// eslint-disable-next-line react/prop-types
const Login = ({ loginSuccess }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  const Auth = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3005/login', {
        username: username,
        password: password,
      })
      navigate('/dashboard')
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
          <span>Belum Memiliki Akun?</span>
          <Link to="/register">
            <button>Daftar Disini</button>
          </Link>
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
              <CFormInput
                type="password"
                id="floatingPassword"
                floatingLabel="Password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button>Masuk </button>
            </div>
            <div className="toRegister">
              <span>Belum Memiliki Akun?</span>
              <Link to="/register">
                <span>Daftar Disini</span>
              </Link>
            </div>
            <Link to="/siswa/login">Masuk sebagai Siswa</Link>
            <p>{msg}</p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
