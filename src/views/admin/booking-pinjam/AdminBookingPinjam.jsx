import React, { useState, useEffect } from 'react'
import './adminBookingPinjam.scss'
import { CButton, CCard, CCardBody, CSmartTable } from '@coreui/react-pro'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import * as XLSX from 'xlsx'

const AdminBookingPinjam = () => {
  const [loading, setLoading] = useState()
  const [dataBooking, setDataBooking] = useState([])

  useEffect(() => {
    fetchData()
    setLoading(false)
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3005/booking-pinjam')
      setDataBooking(response.data.data)
      console.log(response.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (idBookingPinjam) => {
    try {
      await axios.delete(`http://localhost:3005/booking-pinjam/${idBookingPinjam}`)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const columns = [
    {
      key: 'No',
      _style: { width: '5%' },
      filter: false,
      sorter: false,
    },
    {
      key: 'NIS',
      _style: { width: '13%' },
    },
    { key: 'Nama', _style: { width: '18%' } },
    { key: 'kodeBuku', _style: { width: '10%' } },
    { key: 'judul', _style: { width: '21%' } },
    { key: 'waktuBooking', _style: { width: '15%' } },
    { key: 'createdAt', _style: { width: '15%' }, label: 'Tercatat pada' },
    {
      key: 'show_details',
      label: 'Aksi',
      _style: { width: '1%' },
      filter: false,
      sorter: false,
    },
  ]

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
        if (column === 'waktuKunjung') {
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
            createdAt: (item) => {
              return <td className="py-2">{formatDate(item.createdAt)}</td>
            },
            show_details: (item) => {
              return (
                <td className="py-2">
                  <CButton
                    size="sm"
                    color="danger"
                    onClick={() => {
                      const shouldDelete = window.confirm(
                        'Apakah Anda yakin ingin menghapus data ini?',
                      )
                      if (shouldDelete) {
                        handleDelete(item.idBookingPinjam)
                      }
                    }}
                  >
                    Delete
                  </CButton>
                </td>
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
