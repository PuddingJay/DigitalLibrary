import React, { useEffect, useState } from 'react'
import { CButton, CBadge, CCard, CCardBody, CSmartTable, CFormSelect } from '@coreui/react-pro'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import 'react-datepicker/dist/react-datepicker.css'
import './laporan.scss'

const Laporan = () => {
  const [loading, setLoading] = useState()
  const dataPengunjung = [
    {
      NIS: 105219036,
      Nama: 'Samppa Nori',
      Kelas: '11',
      Jurusan: '1',
      WaktuKunjung: '2023-01-01',
    },
    {
      NIS: 105219023,
      Nama: 'Aldo Siagian',
      Kelas: '10',
      Jurusan: '-',
      WaktuKunjung: '2022-02-01',
    },
    {
      NIS: 105219056,
      Nama: 'Nabil Karen',
      Kelas: '12',
      Jurusan: '-',
      WaktuKunjung: '2022-04-01',
    },
  ]
  const [dataPeminjaman, setDataPeminjaman] = useState([])
  const [dataBuku, setDataBuku] = useState([])
  const [selectedOption, setSelectedOption] = useState('Peminjaman')
  const [selectedYear, setSelectedYear] = useState(new Date())
  const [selectedMonth, setSelectedMonth] = useState(null)

  useEffect(() => {
    setLoading(false)
    fetchPeminjaman()
  }, [])

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

  const columnsPeminjaman = [
    {
      key: 'kodeBuku',
      _style: { width: '10%' },
    },
    { key: 'namaPeminjam', _style: { width: '17%' } },
    { key: 'judulBuku', _style: { width: '20%' } },
    { key: 'tglPinjam', _style: { width: '10%' } },
    { key: 'batasPinjam', _style: { width: '12%' } },
    { key: 'tglKembali', _style: { width: '11%' } },
    { key: 'status', _style: { width: '10%' } },
    { key: 'denda', _style: { width: '10%' } },
  ]

  const columnsPustaka = [
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
    { key: 'NIS', _style: { width: '20%' } },
    { key: 'Nama', _style: { width: '30%' } },
    { key: 'Kelas', _style: { width: '10%' } },
    { key: 'Jurusan', _style: { width: '10%' } },
    { key: 'WaktuKunjung', _style: { width: '20' } },
  ]

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value)
    fetchBuku()
  }

  let selectedColumns
  if (selectedOption === 'Peminjaman') {
    selectedColumns = columnsPeminjaman
  } else if (selectedOption === 'Daftar Pustaka') {
    selectedColumns = columnsPustaka
  } else if (selectedOption === 'Data Pengunjung') {
    selectedColumns = columnsPengunjung
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
    const itemYearWaktuKunjung = new Date(item.WaktuKunjung).getFullYear()
    const itemMonthWaktuKunjung = new Date(item.WaktuKunjung).getMonth()
    const itemYearTglPinjam = new Date(item.tglPinjam).getFullYear()
    const itemMonthTglPinjam = new Date(item.tglPinjam).getMonth()
    const itemYearCreatedAt = new Date(item.createdAt).getFullYear()
    const itemMonthCreatedAt = new Date(item.createdAt).getMonth()

    const selectedYearValue = selectedYear.getFullYear()
    const selectedMonthValue = selectedMonth ? selectedMonth.getMonth() : null

    return (
      (itemYearWaktuKunjung === selectedYearValue &&
        (selectedMonth === null || itemMonthWaktuKunjung === selectedMonthValue)) ||
      (itemYearTglPinjam === selectedYearValue &&
        (selectedMonth === null || itemMonthTglPinjam === selectedMonthValue)) ||
      (itemYearCreatedAt === selectedYearValue &&
        (selectedMonth === null || itemMonthCreatedAt === selectedMonthValue))
    )
  })

  const getCsvHeader = () => {
    return selectedColumns.map((column) => column.key).join(',')
  }

  const getCsvRow = (item) => {
    return selectedColumns
      .map((column) => {
        const value = item[column.key]
        return Array.isArray(value) ? value.join(' | ') : value // Separate arrays with ' | '
      })
      .join(',')
  }
  const csvContent = filteredData.map(getCsvRow).join('\n')
  const csvCode =
    'data:text/csv;charset=utf-8,' + encodeURIComponent(getCsvHeader() + '\n' + csvContent)

  return (
    <CCard>
      <CCardBody>
        <CButton
          className="download-button"
          color="primary"
          href={csvCode}
          download="data-laporan.csv"
          target="_blank"
          size="lg"
        >
          <CIcon icon={cilCloudDownload} size="lg" />
          {` `}Download data laporan (.csv)
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
          ]}
        />

        <div className="d-flex mt-2">
          <DatePicker
            selected={selectedYear}
            onChange={(date) => setSelectedYear(date)}
            dateFormat="yyyy"
            showYearPicker
            yearItemNumber={6}
          />
          <DatePicker
            selected={selectedMonth}
            onChange={(date) => setSelectedMonth(date)}
            dateFormat="MM"
            showMonthYearPicker
            className="ms-2"
          />
        </div>

        <CSmartTable
          className="mt-3"
          activePage={3}
          footer
          clickableRows
          columns={selectedColumns} // Use the selected columns here
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
            status: (item) => (
              <td>
                <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
              </td>
            ),
          }}
        />
      </CCardBody>
    </CCard>
  )
}

export default Laporan
