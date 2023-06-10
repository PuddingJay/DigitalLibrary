import React from 'react'
import './login.scss';
import { Link } from 'react-router-dom';
import logo from '../../assets/logoSMA.png';


const Login = () => {
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
          <div className="loginContainer">
            <h1>Login</h1>
            <div className='formLogin'>
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <Link to='/'>
                <button>Masuk </button>
              </Link>
            </div>
          </div>
          {/* <div className="toRegister">
            <span>Belum Memiliki Akun?</span>
            <Link to='/register'>
              <span>Daftar Disini</span>
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Login;
