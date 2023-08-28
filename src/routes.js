import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const DaftarPustaka = React.lazy(() =>
  import('./views/admin/admin-daftarpustaka/AdminDaftarPustaka'),
)
const DataPeminjaman = React.lazy(() => import('./views/admin/admin-peminjaman/AdminPeminjaman'))
const DataAnggota = React.lazy(() => import('./views/admin/admin-dataAnggota/AdminDataAnggota'))
const KotakSaran = React.lazy(() => import('./views/admin/admin-kotakSaran/adminKotakSaran'))
const Approval = React.lazy(() => import('./views/admin/Approval/Approval'))

const Login = React.lazy(() => import('./views/pages/login/Login'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/login', name: 'Login', element: Login },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/Approval', name: 'Approve Buku', element: Approval },
  { path: '/daftarPustaka', name: 'Daftar Pustaka', element: DaftarPustaka },
  { path: '/dataPeminjaman', name: 'Data Peminjaman', element: DataPeminjaman },
  { path: '/dataAnggota', name: 'Data Anggota', element: DataAnggota },
  { path: '/kotakSaran', name: 'Saran Buku dari siswa', element: KotakSaran },
]

export default routes
