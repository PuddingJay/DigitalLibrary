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
const DataPengunjung = React.lazy(() => import('./views/admin/data-pengunjung/DataPengunjung'))
const SiswaLogin = React.lazy(() => import('./views/user/LoginSiswa/LoginSiswa'))
const UpdateData = React.lazy(() => import('./views/admin/updateData/UpdateData'))
const BookingPinjam = React.lazy(() => import('./views/admin/booking-pinjam/AdminBookingPinjam'))
const Laporan = React.lazy(() => import('./views/admin/laporan/Laporan'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/login', name: 'Login', element: Login },
  { path: '/siswa/login', name: 'LoginSiswa', element: SiswaLogin },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/Approval', name: 'Approve Buku', element: Approval },
  { path: '/daftarPustaka', name: 'Daftar Pustaka', element: DaftarPustaka },
  { path: '/dataPeminjaman', name: 'Data Peminjaman', element: DataPeminjaman },
  { path: '/dataAnggota', name: 'Data Anggota', element: DataAnggota },
  { path: '/kotakSaran', name: 'Saran Buku dari siswa', element: KotakSaran },
  { path: '/data-pengunjung', name: 'Data Pengunjung', element: DataPengunjung },
  { path: '/booking-pinjam', name: 'Booking Pinjam', element: BookingPinjam },
  { path: '/updateData', name: 'Informasi Profil', element: UpdateData },
  { path: '/laporan', name: 'Laporan', element: Laporan },
]

export default routes
