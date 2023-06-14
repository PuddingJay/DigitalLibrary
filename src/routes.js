import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const DaftarPustaka = React.lazy(() =>
  import('./views/admin/admin-daftarpustaka/AdminDaftarPustaka'),
)
const DataAnggota = React.lazy(() => import('./views/admin/admin-dataAnggota/AdminDataAnggota'))
const DataPeminjaman = React.lazy(() => import('./views/admin/admin-peminjaman/AdminPeminjaman'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/daftarPustaka', name: 'Daftar Pustaka', element: DaftarPustaka },
  { path: '/dataPeminjaman', name: 'Data Peminjaman', element: DataPeminjaman },
  { path: '/dataAnggota', name: 'Data Anggota', element: DataAnggota },
]

export default routes
