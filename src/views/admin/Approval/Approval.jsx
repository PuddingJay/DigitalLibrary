/* eslint-disable prettier/prettier */
// import './Approval.scss';
import React, { useState, useEffect, useRef } from 'react'
import '../admin-dataAnggota/AdminDataAnggota.scss'
import './Approval.scss'

import { CButton, CCard, CCardBody, CCollapse, CSmartTable, CBadge } from '@coreui/react-pro'
import { CAvatar, CImage } from '@coreui/react'

import axios from 'axios'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import { Link, useNavigate } from 'react-router-dom'
import jwtDecode from 'jwt-decode'

const Approval = () => {
  const [loading, setLoading] = useState()
  const [DaftarPustaka, setDaftarPustaka] = useState([])
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const navigate = useNavigate()

  const formRef = useRef(null)
  const [name, setName] = useState('')

  useEffect(() => {
    RefreshToken()
  }, [])

  const RefreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      const response = await axios.get(`http://localhost:3005/token/${refreshToken}`)
      const decoded = jwtDecode(response.data.accessToken)

      setName(decoded.name)
      if (decoded.role !== 'superadmin') {
        navigate('/dashboard') // Ganti '/dashboard' dengan rute yang sesuai
        alert('Anda tidak punya akses untuk halaman ini')
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
    setLoading(false)
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3005/book')
      setDaftarPustaka(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  const OnChangeApprove = async (kodeBuku) => {
    const isApproved = window.confirm(
      'Sebelum klik Disetujui, silahkan klik show ebook terlebih dahulu, dan cek apakah lisensi buku sudah sesuai ? Jika iya klik tombol ok!',
    )
    if (isApproved) {
      const data = { isApproval: 'Disetujui' }

      try {
        await axios.put(`http://localhost:3005/updateApprove/${kodeBuku}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        fetchData()
      } catch (err) {
        console.error(err)
      }
    } else {
    }
  }
  const OnChangeRejected = async (kodeBuku) => {
    const data = { isApproval: 'Ditolak' }

    try {
      await axios.put(`http://localhost:3005/updateRejected/${kodeBuku}`, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const [details, setDetails] = useState([])
  const columns = [
    {
      key: 'kodeBuku',
      _style: { width: '12%' },
    },
    { key: 'judul', _style: { width: '17%' } },
    { key: 'penulis', _style: { width: '20%' } },
    { key: 'kategori', _style: { width: '10%' } },
    { key: 'keterangan', _style: { width: '10%' } },
    { key: 'jumlah', _style: { width: '5%' } },
    { key: 'tersedia', _style: { width: '5%' } },
    {
      key: 'isApproval',
      _style: { width: '10%' },
    },
    {
      key: 'berkasBuku',
      _style: { width: '10%' },
    },

    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      filter: false,
      sorter: false,
    },
  ]
  const getBadge = (isApproval) => {
    switch (isApproval) {
      case 'Disetujui':
        return 'primary'
      case 'Belum Disetujui':
        return 'warning'
      case 'Ditolak':
        return 'danger'
      default:
        return 'primary'
    }
  }
  const toggleDetails = (index) => {
    const position = details.indexOf(index)
    let newDetails = details.slice()
    if (position !== -1) {
      newDetails.splice(position, 1)
    } else {
      newDetails = [...details, index]
    }
    setDetails(newDetails)
  }

  // buat download
  const getCsvHeader = () => {
    return columns.map((column) => column.key).join(',')
  }

  const getCsvRow = (item) => {
    return columns
      .map((column) => {
        const value = item[column.key]
        return Array.isArray(value) ? value.join(' | ') : value // Separate arrays with ' | '
      })
      .join(',')
  }
  const csvContent = DaftarPustaka.map(getCsvRow).join('\n')
  const csvCode =
    'data:text/csv;charset=utf-8,' + encodeURIComponent(getCsvHeader() + '\n' + csvContent)

  try {
    return (
      <>
        <CCard>
          <CCardBody>
            <div className="actionDaftarPustaka">
              <div className="download-container">
                <CButton
                  className="download-button"
                  color="primary"
                  href={csvCode}
                  download="data-peminjaman.csv"
                  target="_blank"
                  size="lg"
                >
                  <CIcon icon={cilCloudDownload} size="lg" />
                  {/* Download data peminjaman (.csv) */}
                </CButton>
              </div>
            </div>

            <CSmartTable
              className="mt-3"
              activePage={3}
              cleaner
              footer
              clickableRows
              columns={columns}
              loading={loading}
              // columnFilter
              columnSorter
              items={DaftarPustaka}
              itemsPerPageSelect
              itemsPerPage={5}
              pagination
              scopedColumns={{
                isApproval: (item) => (
                  <td>
                    <CBadge color={getBadge(item.isApproval)}>{item.isApproval}</CBadge>
                  </td>
                ),
                show_details: (item) => {
                  return (
                    <td className="py-2">
                      <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => {
                          toggleDetails(item.kodeBuku)
                        }}
                      >
                        {details.includes(item.kodeBuku) ? 'Hide' : 'Aksi'}
                      </CButton>
                    </td>
                  )
                },
                details: (item) => {
                  return (
                    <CCollapse visible={details.includes(item.kodeBuku)}>
                      <CCardBody className="p-3">
                        <h4>Buku {item.judul}</h4>
                        <p className="text-muted">Ditulis oleh {item.penulis}</p>
                        <p className="text-muted">Tahun terbit {item.tahun_terbit}</p>

                        <CButton
                          size="sm"
                          color="primary"
                          onClick={() => OnChangeApprove(item.kodeBuku)}
                        >
                          Disetujui
                        </CButton>
                        <CButton
                          size="sm"
                          color="primary"
                          onClick={() => OnChangeRejected(item.kodeBuku)}
                        >
                          Ditolak
                        </CButton>

                        <Link to={`/ShowPdf/${item.kodeBuku}`}>
                          <CButton size="sm" color="dark">
                            Show Ebook
                          </CButton>
                        </Link>

                        {/* <CImage fluid src="/images/react.jpg" /> */}
                        <CImage
                          src={`http://localhost:3005/${item.cover}`}
                          width={100}
                          height={100}
                        />
                      </CCardBody>
                    </CCollapse>
                  )
                },
              }}
              sorterValue={{ column: 'name', state: 'asc' }}
              tableFilter
              tableHeadProps={{
                color: 'info',
              }}
              tableProps={{
                hover: true,
                responsive: true,
              }}
            />
          </CCardBody>
        </CCard>
      </>
    )
  } catch (e) {
    alert(e.message)
  }
}

export default Approval
