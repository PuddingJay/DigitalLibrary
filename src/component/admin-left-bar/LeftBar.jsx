import React from 'react'
import './leftBar.scss'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

export default function LeftBar() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.delete('http://localhost:3005/logout')
      navigate('/login')
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="leftBar">
      <div className="menu">
        <ul>
          <Link to="/dashboard">
            <li>Dashboard</li>
          </Link>
          <Link to="/daftarpustaka">
            <li>Daftar Pustaka</li>
          </Link>
          <Link to='/peminjaman'>
            <li>Peminjaman</li>
          </Link>
          <Link to='/dataAnggota'>
            <li>Data Anggota</li>
          </Link>
          <li>
            <a href='/login' onClick={logout}>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  )
}
