import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilSpreadsheet, cilBook, cilPeople } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react-pro'

const _nav = [
  {
    component: CNavTitle,
    name: 'Menu',
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Approval Buku',
    to: '/Approval',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Daftar Pustaka',
    to: '/daftarPustaka',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Data Peminjaman',
    to: '/dataPeminjaman',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Data Anggota',
    to: '/dataAnggota',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Permintaan Buku',
    to: '/kotakSaran',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
  },
]

export default _nav
