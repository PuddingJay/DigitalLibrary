import React, { useState } from 'react'
import { CFormInput } from '@coreui/react-pro'
import { Link, useNavigate } from 'react-router-dom'
import './register.scss'
import axios from 'axios'

const Register = () => {
  const [nama, setNama] = useState(null)
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const [confPassword, setConfPassword] = useState(null)
  const [msg, setMsg] = useState(null)
  const navigate = useNavigate()

  const Regis = async (e) => {
    e.preventDefault()

    try {
      await axios.post('http://localhost:3005/admin', {
        name: nama,
        username: username,
        password: password,
        confPassword: confPassword,
      })

      navigate('/login')
      // window.location.href = '/login'
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
              <CFormInput
                type="password"
                id="floatingPassword"
                floatingLabel="Password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <CFormInput
                type="password"
                id="floatingConfPassword"
                floatingLabel="Confirm Password"
                placeholder="Confirm Password"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
              />
              <button>Daftar </button>
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
