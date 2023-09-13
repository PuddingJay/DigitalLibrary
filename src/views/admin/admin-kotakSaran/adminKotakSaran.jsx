/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import './adminKotakSaran.scss'
import { CButton, CCard, CCardBody, CSmartTable } from '@coreui/react-pro'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'

const AdminKotakSaran = () => {
  const [loading, setLoading] = useState()
  const [kotakSaran, setkotakSaran] = useState([])

  useEffect(() => {
    fetchData()
    setLoading(false)
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('https://api2.librarysmayuppentek.sch.id/kotaksaran')
      setkotakSaran(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (idPengadaan) => {
    try {
      await axios.delete(`https://api2.librarysmayuppentek.sch.id/kotaksaran/${idPengadaan}`)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const columns = [
    {
      key: 'siswa_NIS',
      _style: { width: '18%' },
    },
    { key: 'nama', _style: { width: '18%' } },
    { key: 'judulBuku', _style: { width: '18%' } },
    { key: 'pengarang', _style: { width: '50%' } },

    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      filter: false,
      sorter: false,
    },
  ]

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
  const csvContent = kotakSaran.map(getCsvRow).join('\n')
  const csvCode =
    'data:text/csv;charset=utf-8,' + encodeURIComponent(getCsvHeader() + '\n' + csvContent)

  try {
    return (
      <>
        <CCard>
          {/* <div className="download-container"> */}

          {/* </div>/ */}
          <CCardBody>
            <CButton
              className="download-button"
              color="primary"
              href={csvCode}
              download="data-saran buku.csv"
              target="_blank"
              size="lg"
            >
              <CIcon icon={cilCloudDownload} size="lg" />
              {/* Download data peminjaman (.csv) */}
            </CButton>
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
              items={kotakSaran}
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
                            'Apakah Anda yakin ingin menghapus item ini?',
                          )
                          if (shouldDelete) {
                            handleDelete(item.idPengadaan)
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
              columnFilter
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

export default AdminKotakSaran
