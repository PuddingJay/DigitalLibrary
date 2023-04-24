import React from 'react'
import './leftBar.scss'
import { Link } from 'react-router-dom'

export default function LeftBar() {
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
          <Link to='/login'>
            <li>Logout</li>
          </Link>
        </ul>
      </div>
    </div>
  )
}
