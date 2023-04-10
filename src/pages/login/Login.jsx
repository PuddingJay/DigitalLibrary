import React from 'react'
import './login.scss';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Selamat Datang</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam nesciunt quam odio porro doloremque soluta ab provident ullam rem nemo fuga quis, odit ipsa enim excepturi molestiae commodi? Explicabo, aliquam!</p>
          <span>Belum Memiliki Akun?</span>
          <Link to='/register'>
            <button>Daftar Disini</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <div>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <Link to='/'>
              <button>Masuk </button>
            </Link>
          </div>
          <div className="toRegister">
            <span>Belum Memiliki Akun?</span>
            <Link to='/register'>
              <span>Daftar Disini</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
