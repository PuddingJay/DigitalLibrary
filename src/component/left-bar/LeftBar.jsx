import React from 'react'
import './leftBar.scss'

export default function LeftBar() {
  return (
    <div className="leftBar">
      <div className="menu">
        <ul>
          <li>Dashboard</li>
          <li>Daftar Pustaka</li>
          <li>Peminjaman</li>
          <li>Data Anggota</li>
          <li>Logout</li>
        </ul>
      </div>
    </div>
  )
}
