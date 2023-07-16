import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const DaftarPustaka = React.lazy(() =>
  import('./views/admin/admin-daftarpustaka/AdminDaftarPustaka'),
)
const DataPeminjaman = React.lazy(() => import('./views/admin/admin-peminjaman/AdminPeminjaman'))
const DataAnggota = React.lazy(() => import('./views/admin/admin-dataAnggota/AdminDataAnggota'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const SiswaLogin = React.lazy(() => import('./views/user/LoginSiswa/LoginSiswa'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/login', name: 'Login', element: Login },
  { path: '/siswa/login', name: 'LoginSiswa', element: SiswaLogin },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/daftarPustaka', name: 'Daftar Pustaka', element: DaftarPustaka },
  { path: '/dataPeminjaman', name: 'Data Peminjaman', element: DataPeminjaman },
  { path: '/dataAnggota', name: 'Data Anggota', element: DataAnggota },
]

export default routes
