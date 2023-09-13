import React, { useState, useEffect } from 'react'
import './adminBookingPinjam.scss'
import { CButton, CCard, CCardBody, CSmartTable, CBadge, CCollapse } from '@coreui/react-pro'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import * as XLSX from 'xlsx'

const AdminBookingPinjam = () => {
  const [loading, setLoading] = useState()
  const [dataBooking, setDataBooking] = useState([])

  const getBadge = (status) => {
    switch (status) {
      case 'Kadaluarsa':
        return 'danger'
      case 'Belum Dipinjam':
        return 'warning'
      case 'Dipinjam':
        return 'primary'
      default:
        return 'primary'
    }
  }

  const fetchData = async () => {
    try {
      const currentDate = new Date()
      const twoDaysinMilliseconds = 2 * 24 * 60 * 60 * 1000 // 2 days in milliseconds
      const response = await axios.get('https://api2.librarysmayuppentek.sch.id/booking-pinjam')
      const updatedDataPromises = response.data.data.map(async (item) => {
        if (item.status === 'Belum Dipinjam') {
          const tglPemesanan = new Date(item.tglPemesanan)
          const timeDifference = currentDate - tglPemesanan

          if (timeDifference >= twoDaysinMilliseconds) {
            return {
              ...item,
              status: 'Kadaluarsa',
            }
          }
          axios.put(
            `https://api2.librarysmayuppentek.sch.id/booking-pinjam/${item.idReservasi}`,
            item,
          )
        }
        return item
      })

      const updatedData = await Promise.all(updatedDataPromises)
      // console.log(updatedData)
      setDataBooking(updatedData)
      // console.log(dataBooking)
    } catch (error) {
      alert(error.message)
    }
  }

  useEffect(() => {
    fetchData()
    setLoading(false)
  }, [])

  const handleDelete = async (idBookingPinjam) => {
    try {
      await axios.delete(
        `https://api2.librarysmayuppentek.sch.id/booking-pinjam/${idBookingPinjam}`,
      )
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const handleDipinjam = async (idBookingPinjam) => {
    try {
      const response = await axios.put(
        `https://api2.librarysmayuppentek.sch.id/booking-pinjam/${idBookingPinjam}`,
        {
          status: 'Dipinjam',
        },
      )

      // Update the bookings list with the updated status
      const updatedBookings = dataBooking.map((booking) => {
        if (booking.idReservasi === idBookingPinjam) {
          return {
            ...booking,
            status: 'Dipinjam',
          }
        }
        return booking
      })

      setDataBooking(updatedBookings) // Update the state with new bookings list
      console.log(response.data.message) // Log the response message
    } catch (error) {
      console.error(error)
    }
  }

  const [details, setDetails] = useState([])
  const columns = [
    {
      key: 'No',
      _style: { width: '1%' },
      filter: false,
      sorter: false,
    },
    {
      key: 'Siswa_NIS',
      label: 'NIS/ID',
      _style: { width: '10%' },
    },
    { key: 'nama', _style: { width: '18%' } },
    { key: 'Buku_kodeBuku', _style: { width: '10%' }, label: 'Kode Buku' },
    { key: 'judul', _style: { width: '21%' } },
    { key: 'tglPemesanan', _style: { width: '15%' }, label: 'Tanggal Mau Pinjam' },
    { key: 'status', _style: { width: '8%' } },
    { key: 'createdAt', _style: { width: '15%' }, label: 'Tercatat pada' },
    {
      key: 'show_details',
      label: 'Aksi',
      _style: { width: '1%' },
      filter: false,
      sorter: false,
    },
  ]
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

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString)
    const year = dateObject.getFullYear()
    const month = String(dateObject.getMonth() + 1).padStart(2, '0')
    const day = String(dateObject.getDate()).padStart(2, '0')
    const time = dateObject.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

    return `${year}-${month}-${day}, ${time}`
  }

  const getExcelData = () => {
    if (!dataBooking || !dataBooking[0]) {
      alert('Tidak bisa download data kosong')
      return new Blob()
    }
    const header = Object.keys(dataBooking[0])
    const data = dataBooking.map((item) => {
      const formattedBookingPinjam = formatDate(item.createdAt)
      return header.map((column) => {
        if (column === 'createdAt') {
          return formattedBookingPinjam
        }
        return item[column]
      })
    })

    const ws = XLSX.utils.aoa_to_sheet([header, ...data])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    return blob
  }

  const downloadExcel = () => {
    const blob = getExcelData()
    if (blob.size > 0) {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'data-booking-pinjam.xlsx'
      link.click()
    }
  }

  return (
    <CCard>
      <CCardBody>
        {/* <div className="download-container" style={{ display: 'flex', justifyContent: 'flex-end' }}> */}
        <CButton
          className="download-button"
          color="primary"
          onClick={downloadExcel}
          target="_blank"
          size="lg"
        >
          <CIcon icon={cilCloudDownload} size="lg" />
          {` `}Download data Booking Pinjam (.xslx)
        </CButton>
        {/* </div> */}
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
          items={dataBooking}
          itemsPerPageSelect
          itemsPerPage={5}
          pagination
          scopedColumns={{
            No: (item, index) => {
              const itemNumber = index + 1
              return <td>{itemNumber}</td>
            },
            status: (item) => (
              <td>
                <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
              </td>
            ),
            createdAt: (item) => {
              return <td className="py-2">{formatDate(item.createdAt)}</td>
            },
            show_details: (item) => {
              // console.log(item.idReservasi)
              return (
                <td className="py-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    onClick={() => {
                      toggleDetails(item.idReservasi)
                    }}
                  >
                    {details.includes(item.idReservasi) ? 'Hide' : 'Show'}
                  </CButton>
                </td>
              )
            },
            details: (item) => {
              return (
                <CCollapse visible={details.includes(item.idReservasi)}>
                  <CCardBody className="p-3">
                    <h4>Nama: {item.nama}</h4>
                    <CButton
                      size="sm"
                      color="primary"
                      className="me-2"
                      onClick={() => {
                        const yakinPinjam = window.confirm('Konfirmasi buku sudah dipinjam ?')
                        if (yakinPinjam) {
                          handleDipinjam(item.idReservasi)
                        }
                      }}
                    >
                      Konfirmasi Dipinjam
                    </CButton>
                    <CButton
                      size="sm"
                      color="danger"
                      onClick={() => {
                        const shouldDelete = window.confirm(
                          'Apakah Anda yakin ingin menghapus data ini?',
                        )
                        if (shouldDelete) {
                          handleDelete(item.idReservasi)
                        }
                      }}
                    >
                      Delete
                    </CButton>
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
  )
}

export default AdminBookingPinjam
