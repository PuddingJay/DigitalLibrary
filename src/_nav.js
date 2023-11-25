import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilSpreadsheet,
  cilBook,
  cilPeople,
  cilDescription,
  cilNoteAdd,
  cilAddressBook,
  cilInbox,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react-pro'
import axios from 'axios'

const SidebarData = () => {
  const [totalBooking, setTotalBooking] = useState([])

  useEffect(() => {
    axios
      .get('https://api2.librarysmayuppentek.sch.id/booking-pinjam')
      .then((response) => {
        setTotalBooking(response.data.data.length)
      })
      .catch((error) => {
        console.error('Error fetching Siswa data:', error)
      })
  }, [])

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
      name: 'Data Pengunjung',
      to: '/data-pengunjung',
      icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Booking Pinjam',
      to: '/booking-pinjam',
      icon: <CIcon icon={cilInbox} customClassName="nav-icon" />,
      badge: {
        color: 'danger',
        text: totalBooking.toString(),
      },
    },
    {
      component: CNavItem,
      name: 'Permintaan Buku',
      to: '/kotakSaran',
      icon: <CIcon icon={cilNoteAdd} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Laporan',
      to: '/laporan',
      icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    },
  ]

  return _nav
}

export default SidebarData
