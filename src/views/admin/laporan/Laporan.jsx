import React, { useEffect, useState } from 'react'
import { CButton, CBadge, CCard, CCardBody, CSmartTable, CFormSelect } from '@coreui/react-pro'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import 'react-datepicker/dist/react-datepicker.css'
import * as XLSX from 'xlsx'
import './laporan.scss'

const Laporan = () => {
  const [loading, setLoading] = useState()
  const [dataPeminjaman, setDataPeminjaman] = useState([])
  const [dataBuku, setDataBuku] = useState([])
  const [dataPengunjung, setDataPengunjung] = useState([])
  const [dataBooking, setDataBooking] = useState([])

  const [selectedOption, setSelectedOption] = useState('Peminjaman')
  const [selectedYear, setSelectedYear] = useState(new Date())
  const [selectedMonth, setSelectedMonth] = useState(null)

  useEffect(() => {
    console.log(filteredData)
  })

  useEffect(() => {
    setLoading(false)
    fetchPeminjaman()
  }, [])

  const fetchPengunjung = async () => {
    try {
      const response = await axios.get('http://localhost:3005/data-pengunjung')
      setDataPengunjung(response.data.data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchPeminjaman = async () => {
    try {
      const response = await axios.get('http://localhost:3005/peminjaman')
      setDataPeminjaman(response.data.data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchBuku = async () => {
    try {
      const responseBook = await axios.get('http://localhost:3005/book')
      setDataBuku(responseBook.data?.data ?? [])
    } catch (err) {
      console.log(err)
    }
  }

  const fetchBooking = async () => {
    try {
      const response = await axios.get('http://localhost:3005/booking-pinjam')
      setDataBooking(response.data.data)
      console.log(response.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''

    const dateObj = new Date(dateString)
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    const time = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

    return `${year}-${month}-${day}, Pukul ${time}`
  }

  const columnsPustaka = [
    {
      key: 'No',
      _style: { width: '1%' },
      filter: false,
      sorter: false,
    },
    {
      key: 'kodeBuku',
      _style: { width: '12%' },
    },
    { key: 'judul', _style: { width: '17%' } },
    { key: 'penulis', _style: { width: '20%' } },
    { key: 'Kategori', _style: { width: '10%' } },
    { key: 'keterangan', _style: { width: '10%' } },
    { key: 'jumlah', _style: { width: '10%' } },
    { key: 'tersedia', _style: { width: '10%' } },
    { key: 'createdAt', _style: { width: '10%' } },
  ]

  const columnsPengunjung = [
    {
      key: 'No',
      _style: { width: '3%' },
      filter: false,
      sorter: false,
    },
    { key: 'NIS', _style: { width: '10%' } },
    { key: 'nama', _style: { width: '20%' } },
    { key: 'kelas', _style: { width: '10%' } },
    { key: 'waktuKunjung', _style: { width: '20' } },
  ]

  const columnsPeminjaman = [
    {
      key: 'No',
      _style: { width: '1%' },
      filter: false,
      sorter: false,
    },
    {
      key: 'kodeBuku',
      _style: { width: '7%' },
    },
    { key: 'namaPeminjam', _style: { width: '15%' } },
    { key: 'judulBuku', _style: { width: '15%' } },
    { key: 'tglPinjam', _style: { width: '10%' } },
    { key: 'batasPinjam', _style: { width: '12%' } },
    { key: 'tglKembali', _style: { width: '11%' } },
    { key: 'status', _style: { width: '10%' } },
    { key: 'denda', _style: { width: '10%' } },
    { key: 'createdAt', _style: { width: '10%' }, label: 'Tercatat Pada' },
  ]

  const columnsBooking = [
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
  ]

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value)
    fetchBuku()
    fetchPengunjung()
    fetchBooking()
  }

  let selectedColumns
  if (selectedOption === 'Peminjaman') {
    selectedColumns = columnsPeminjaman
  } else if (selectedOption === 'Daftar Pustaka') {
    selectedColumns = columnsPustaka
  } else if (selectedOption === 'Data Pengunjung') {
    selectedColumns = columnsPengunjung
  } else if (selectedOption === 'Data Booking Pinjam') {
    selectedColumns = columnsBooking
  } else {
    selectedColumns = columnsPeminjaman
  }

  let selectedData
  if (selectedOption === 'Peminjaman') {
    selectedData = dataPeminjaman
  } else if (selectedOption === 'Daftar Pustaka') {
    selectedData = dataBuku
  } else if (selectedOption === 'Data Pengunjung') {
    selectedData = dataPengunjung
  } else if (selectedOption === 'Data Booking Pinjam') {
    selectedData = dataBooking
  } else {
    selectedData = dataPeminjaman
  }

  const getBadge = (status) => {
    switch (status) {
      case 'Dikembalikan':
        return 'primary'
      case 0:
        return 'secondary'
      case 'Lunas':
        return 'success'
      case 'Belum Dikembalikan':
        return 'danger'
      default:
        return 'primary'
    }
  }

  const filteredData = selectedData.filter((item) => {
    const itemYearWaktuKunjung = new Date(item.waktuKunjung).getFullYear()
    const itemMonthWaktuKunjung = new Date(item.waktuKunjung).getMonth()
    const itemYearCreatedAt = new Date(item.createdAt).getFullYear()
    const itemMonthCreatedAt = new Date(item.createdAt).getMonth()

    const selectedYearValue = selectedYear.getFullYear()
    const selectedMonthValue = selectedMonth ? selectedMonth.getMonth() : null

    return (
      (itemYearWaktuKunjung === selectedYearValue &&
        (selectedMonth === null || itemMonthWaktuKunjung === selectedMonthValue)) ||
      (itemYearCreatedAt === selectedYearValue &&
        (selectedMonth === null || itemMonthCreatedAt === selectedMonthValue))
    )
  })

  const getExcelData = () => {
    if (!filteredData || !filteredData[0]) {
      alert('Tidak bisa download data kosong')
      return new Blob()
    }
    const header = Object.keys(filteredData[0])
    const data = filteredData.map((item) => {
      const formattedWaktuKunjung = formatDate(item.waktuKunjung)
      const formattedCreatedAt = formatDate(item.createdAt)

      return header.map((column) => {
        if (column === 'waktuKunjung') {
          return formattedWaktuKunjung
        } else if (column === 'createdAt') {
          return formattedCreatedAt
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
      link.download = 'data-laporan.xlsx'
      link.click()
    }
  }

  return (
    <CCard>
      <CCardBody>
        <CButton
          className="download-button"
          color="primary"
          onClick={downloadExcel}
          target="_blank"
          size="lg"
        >
          <CIcon icon={cilCloudDownload} size="lg" />
          {` `}Download data laporan (.xlsx)
        </CButton>

        <CFormSelect
          className="mt-2"
          aria-label="Default select example"
          value={selectedOption}
          onChange={handleOptionChange}
          options={[
            'Open this select menu',
            { label: 'Peminjaman', value: 'Peminjaman' },
            { label: 'Pustaka', value: 'Daftar Pustaka' },
            { label: 'Data Pengunjung', value: 'Data Pengunjung' },
            { label: 'Data Booking Pinjam', value: 'Data Booking Pinjam' },
          ]}
        />

        <div className="d-flex mt-2">
          <DatePicker
            selected={selectedYear}
            onChange={(date) => setSelectedYear(date)}
            dateFormat="yyyy"
            showYearPicker
            className="form-control"
            yearItemNumber={6}
          />
          <DatePicker
            selected={selectedMonth}
            onChange={(date) => setSelectedMonth(date)}
            dateFormat="MM"
            className="form-control ms-2"
            showMonthYearPicker
          />
        </div>

        <CSmartTable
          className="mt-3"
          activePage={3}
          footer
          clickableRows
          columns={selectedColumns}
          columnSorter
          loading={loading}
          items={filteredData}
          itemsPerPageSelect
          itemsPerPage={5}
          pagination
          sorterValue={{ column: 'name', state: 'asc' }}
          tableHeadProps={{
            color: 'info',
          }}
          tableProps={{
            hover: true,
            responsive: true,
          }}
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
            waktuKunjung: (item) => {
              return <td className="py-2">{formatDate(item.waktuKunjung)}</td>
            },
          }}
        />
      </CCardBody>
    </CCard>
  )
}

export default Laporan
