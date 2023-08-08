import React, { useState, useEffect } from 'react'
import './adminBookingPinjam.scss'
import { CButton, CCard, CCardBody, CSmartTable } from '@coreui/react-pro'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'

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
      key: 'NIS',
      _style: { width: '13%' },
    },
    { key: 'Nama', _style: { width: '18%' } },
    { key: 'kodeBuku', _style: { width: '10%' } },
    { key: 'judul', _style: { width: '21%' } },
    { key: 'waktuBooking', _style: { width: '15%' } },
    { key: 'createdAt', _style: { width: '15%' } },
    {
      key: 'show_details',
      label: 'Aksi',
      _style: { width: '1%' },
      filter: false,
      sorter: false,
    },
  ]

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
  const csvContent = dataBooking.map(getCsvRow).join('\n')
  const csvCode =
    'data:text/csv;charset=utf-8,' + encodeURIComponent(getCsvHeader() + '\n' + csvContent)

  return (
    <CCard>
      <CCardBody>
        {/* <div className="download-container" style={{ display: 'flex', justifyContent: 'flex-end' }}> */}
        <CButton
          className="download-button"
          color="primary"
          href={csvCode}
          download="data-booking-pinjam.csv"
          target="_blank"
          size="lg"
        >
          <CIcon icon={cilCloudDownload} size="lg" />
          {` `}Download data Booking Pinjam (.csv)
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
