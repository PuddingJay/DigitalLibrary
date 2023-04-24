import React from 'react'
import './AdminDashboard.scss'

export default function AdminDashboard() {
  return (
    <>
      <h2>Perpustakaan Digital SMA Yuppentek 1 Kota Tangerang</h2>
      <div className="dashboardContainer">
        <div className="jumlahBukuContainer">
          Jumlah Buku : berapa
        </div>
        <div className="inventarisContainer">
          <div className="peminjaman">Jumlah Peminjaman</div>
          <div className="pengembalian">Jumlah Pengembalian</div>
        </div>

      </div>
    </>
  )
}
