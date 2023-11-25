import React, { useState, useEffect } from 'react'
import './dataPengunjung.scss'
import { CButton, CCard, CCardBody, CSmartTable, CAlert } from '@coreui/react-pro'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilCheckCircle, cilXCircle } from '@coreui/icons'
import * as XLSX from 'xlsx'

const DataPengunjung = () => {
  const [loading, setLoading] = useState(true)
  const [dataPengunjung, setDataPengunjung] = useState([])
  const [msg, setMsg] = useState('')
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('https://api2.librarysmayuppentek.sch.id/data-pengunjung')
      setDataPengunjung(response.data.data)
      setLoading(false)
      console.log(response.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (idPengunjung) => {
    try {
      const response = await axios.delete(
        `https://api2.librarysmayuppentek.sch.id/data-pengunjung/${idPengunjung}`,
      )
      fetchData()
      setMsg(response.data.message)
      setShowSuccessAlert(true)

      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)
    } catch (err) {
      setShowErrorAlert(true)

      setTimeout(() => {
        setShowErrorAlert(false)
      }, 3000)
      setMsg(err.response.data.message)
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
      key: 'nama',
      _style: { width: '13%' },
    },
    { key: 'asal', _style: { width: '18%' } },
    { key: 'tipePengunjung', _style: { width: '18%' }, label: 'Sebagai' },
    { key: 'waktuKunjung', _style: { width: '15%' } },
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
    if (!dataPengunjung || !dataPengunjung[0]) {
      alert('Tidak bisa download data kosong')
      return new Blob()
    }
    const header = Object.keys(dataPengunjung[0])
    const data = dataPengunjung.map((item) => {
      const formattedWaktuKunjung = formatDate(item.waktuKunjung)
      return header.map((column) => {
        if (column === 'waktuKunjung') {
          return formattedWaktuKunjung
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
      link.download = 'data-pengunjung.xlsx'
      link.click()
    }
  }

  return (
    <>
      {showSuccessAlert && (
        <CAlert color="success" className="d-flex align-items-center">
          <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
          <div>{msg}</div>
        </CAlert>
      )}
      {showErrorAlert && (
        <CAlert color="danger" className="d-flex align-items-center">
          <CIcon icon={cilXCircle} className="flex-shrink-0 me-2" width={24} height={24} />
          <div>{msg}</div>
        </CAlert>
      )}
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
            {` `}Download data Pengunjung (.xslx)
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
            items={dataPengunjung}
            itemsPerPageSelect
            itemsPerPage={5}
            pagination
            scopedColumns={{
              No: (item, index) => {
                const itemNumber = index + 1
                return <td>{itemNumber}</td>
              },
              waktuKunjung: (item) => {
                return <td className="py-2">{formatDate(item.waktuKunjung)}</td>
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
                          handleDelete(item.idPengunjung)
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
    </>
  )
}

export default DataPengunjung
