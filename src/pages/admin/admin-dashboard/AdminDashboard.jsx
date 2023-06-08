import React from 'react'
import './AdminDashboard.scss'

export default function AdminDashboard() {
  return (
    <div className="cardLayout">

      <h2 className="dashboardTitle">Perpustakaan Digital SMA Yuppentek 1 Kota Tangerang</h2>
      <div className="dashboardContainer">
        <div className="jumlahBukuContainer">
          Jumlah Buku : 200
        </div>
        <div className="inventarisContainer">
          <div className="peminjaman">Jumlah Peminjaman di Bulan Agustus : 5</div>
          <div className="pengembalian">Kategori Buku : 8</div>
        </div>

      </div>
    </div>
  )
}
