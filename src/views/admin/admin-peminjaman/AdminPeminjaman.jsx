/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import './AdminPeminjaman.scss'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CCollapse,
  CForm,
  CFormInput,
  CFormSelect,
  CSmartTable,
} from '@coreui/react-pro'
import axios from 'axios'
import {
  CDatePicker,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'

const AdminPeminjaman = () => {
  const [loading, setLoading] = useState()
  const [openModal, setOpenModal] = useState(false)
  const [openModalUpdate, setOpenModalUpdate] = useState(false)
  const [peminjaman, setPeminjaman] = useState([])
  const [books, setBooks] = useState([])
  const [siswas, setSiswas] = useState([])
  const [peminjamanDatas, setPeminjamanDatas] = useState(peminjaman)
  const [addFormData, setAddFormData] = useState({
    kodeBuku: null,
    NIS: null,
    namaPeminjam: null,
    judulBuku: null,
    tglKembali: null,
    tglPinjam: null,
    batasPinjam: null,
    status: 'Belum Dikembalikan',
    denda: '',
  })
  const [currentId, setCurrentId] = useState('')
  const batalHandler = () => {
    setAddFormData({})
    setOpenModal(false)
    setOpenModalUpdate(false)
  }

  useEffect(() => {
    fetchData()
    fetchBooks()
    fetchSisws()
    setLoading(false)
  }, [])

  // const fetchJudulBuku = async () => {
  //   const book = books.find((item) => item.kodeBuku === addFormData.kodeBuku);
  //   const judulBuku = book ? book.judul : null;

  //   setAddFormData((prevFormData) => ({
  //     ...prevFormData,
  //     judulBuku: judulBuku,
  //   }));
  // };

  const fetchNamaSiswa = async () => {
    const sisw = siswas.find((item) => item.NIS === addFormData.NIS)
    const NISSiswa = sisw ? sisw.NIS : null

    setAddFormData((prevFormData) => ({
      ...prevFormData,
      NIS: NISSiswa,
    }))
  }

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3005/peminjaman')
      setPeminjaman(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchBooks = async () => {
    try {
      const responseBook = await axios.get('http://localhost:3005/book')
      setBooks(responseBook.data?.data ?? [])
      console.log(responseBook)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchSisws = async () => {
    try {
      const responseSiswa = await axios.get('http://localhost:3005/siswa')
      setSiswas(responseSiswa.data?.data ?? [])
      console.log(responseSiswa.data.data[1].Nama)
    } catch (error) {
      console.log(error)
    }
  }

  const formOnChangeHandler = (event) => {
    const fieldName = event.target.getAttribute('name')
    const fieldValue = event.target.value

    let newFormData
    if (fieldName === 'kodeBuku') {
      const book = books.find((item) => item.kodeBuku === fieldValue)
      const judulBuku = book ? book.judul : null

      newFormData = {
        ...addFormData,
        kodeBuku: fieldValue,
        judulBuku: judulBuku,
      }
    } else if (fieldName === 'NIS') {
      const nisValue = parseInt(fieldValue)
      const sisw = siswas.find((item) => item.NIS === nisValue)
      const namaSiswa = sisw ? sisw.Nama : null

      newFormData = {
        ...addFormData,
        NIS: nisValue,
        namaPeminjam: namaSiswa,
      }
    } else if (fieldName === 'status') {
      newFormData = {
        ...addFormData,
        [fieldName]: fieldValue,
      }
    } else {
      newFormData = {
        ...addFormData,
        [fieldName]: fieldValue,
      }
    }

    console.log(fieldName, fieldValue)
    console.log(newFormData)

    setAddFormData(newFormData)
  }

  const formOnChangeTglPinjam = (value) => {
    value !== null
      ? setAddFormData({
          ...addFormData,
          tglPinjam: value.toISOString().split('T')[0],
        })
      : setAddFormData({
          ...addFormData,
          tglPinjam: null,
        })
  }

  const formOnChangeBatasPinjam = (value) => {
    value !== null
      ? setAddFormData({
          ...addFormData,
          batasPinjam: value.toISOString().split('T')[0],
        })
      : setAddFormData({
          ...addFormData,
          batasPinjam: null,
        })
  }

  const formOnChangeTglKembali = (value) => {
    value !== null
      ? setAddFormData({
          ...addFormData,
          tglKembali: value.toISOString().split('T')[0],
        })
      : setAddFormData({
          ...addFormData,
          tglKembali: null,
        })
  }

  const formOnSubmitHandler = (event) => {
    event.preventDefault()

    fetchNamaSiswa() // Fetch the namaSiswa value based on the NIS

    const newDataPeminjaman = {
      kodeBuku: addFormData.kodeBuku,
      NIS: addFormData.NIS,
      namaPeminjam: addFormData.namaPeminjam,
      judulBuku: addFormData.judulBuku,
      tglKembali: addFormData.tglKembali,
      batasPinjam: addFormData.batasPinjam,
      tglPinjam: addFormData.tglPinjam,
      status: addFormData.status,
      denda: addFormData.denda,
    }

    console.log(newDataPeminjaman)
    const newDataPeminjamans = [...peminjamanDatas, newDataPeminjaman]
    setPeminjamanDatas(newDataPeminjamans)

    axios
      .post('http://localhost:3005/peminjaman', newDataPeminjaman)
      .then((res) => {
        console.log(res)
        setOpenModal(false)
        fetchData()
        setAddFormData({})
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleDelete = async (idPeminjaman) => {
    try {
      await axios.delete(`http://localhost:3005/peminjaman/${idPeminjaman}`)
      fetchData()
    } catch (err) {
      console.log(err)
    }
  }

  const OnChangeKembali = async (idPeminjaman) => {
    const siswa = peminjaman.find((item) => item.idPeminjaman === idPeminjaman)

    const totalDenda = (tglKembaliDenda, batasPinjamDenda) => {
      const start = new Date(tglKembaliDenda)
      const end = new Date(batasPinjamDenda)

      const difference = start.getTime() - end.getTime()
      const days = Math.ceil(difference / (1000 * 60 * 60 * 24))
      const chargePerDay = 3000
      const totalCharge = chargePerDay * days

      return totalCharge > 0 ? 'Rp. ' + totalCharge : '-'
    }

    const editedDataPeminjaman = {
      ...siswa,
      tglKembali: new Date().toISOString().split('T')[0],
      status: 'Dikembalikan',
      denda: totalDenda(siswa.tglKembali, siswa.batasPinjam),
    }

    try {
      await axios.put(`http://localhost:3005/peminjaman/${idPeminjaman}`, editedDataPeminjaman)
      fetchData()
    } catch (err) {
      console.error(err)
    }
    setAddFormData('')
  }

  const toggleUpdate = async (idPeminjaman) => {
    setOpenModalUpdate(!openModalUpdate)
    const siswa = peminjaman.find((item) => item.idPeminjaman === idPeminjaman)
    setCurrentId(siswa)
    console.log(currentId)
  }

  const formUpdateChangeHandler = (e) => {
    const { name, value } = e.target
    setCurrentId((prevState) => ({
      ...prevState,
      [name]: value,
    }))

    if (name === 'NIS') {
      const nisValue = parseInt(value)
      const sisw = siswas.find((item) => item.NIS === nisValue)
      if (sisw) {
        setCurrentId((prevState) => ({
          ...prevState,
          namaPeminjam: sisw.Nama,
        }))
      }
    } else if (name === 'kodeBuku') {
      const book = books.find((item) => item.kodeBuku === value)
      if (book) {
        setCurrentId((prevState) => ({
          ...prevState,
          judulBuku: book.judul,
        }))
      }
    }

    console.log(currentId)
  }

  const formOnChangeDateHandler = (name, date) => {
    date !== null
      ? setCurrentId((prevState) => ({
          ...prevState,
          [name]: date.toISOString().split('T')[0],
        }))
      : setCurrentId((prevState) => ({
          ...prevState,
          [name]: null,
        }))
  }

  const formUpdateHandler = async (event) => {
    event.preventDefault()

    try {
      await axios.put(`http://localhost:3005/peminjaman/${currentId.idPeminjaman}`, currentId)
      fetchData()
      batalHandler()
    } catch (err) {
      console.error(err)
    }
    console.log(currentId)
  }

  const [details, setDetails] = useState([])
  const columns = [
    {
      key: 'kodeBuku',
      _style: { width: '12%' },
    },
    { key: 'namaPeminjam', _style: { width: '17%' } },
    { key: 'judulBuku', _style: { width: '20%' } },
    { key: 'tglPinjam', _style: { width: '10%' } },
    { key: 'batasPinjam', _style: { width: '10%' } },
    { key: 'tglKembali', _style: { width: '10%' } },
    { key: 'status', _style: { width: '12%' } },
    { key: 'denda', _style: { width: '13%' } },
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      filter: false,
      sorter: false,
    },
  ]
  const getBadge = (status) => {
    switch (status) {
      case 'Dikembalikan':
        return 'success'
      case '-':
        return 'secondary'
      case 'Pending':
        return 'warning'
      case 'Belum Dikembalikan':
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
  const csvContent = peminjaman.map((item) => Object.values(item).join(',')).join('\n')
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent)

  try {
    return (
      <>
        <CCard>
          <CCardBody>
            <CButton
              color="primary"
              size="lg"
              className="btnModal"
              onClick={() => {
                setOpenModal(!openModal)
              }}
            >
              Tambah Data Pinjam
            </CButton>

            <CModal
              allignment="center"
              size="lg"
              scrollable
              visible={openModal}
              onClose={() => batalHandler()}
            >
              <CModalHeader>
                <CModalTitle>Tambah Data Peminjaman</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CForm className="row g-3" onSubmit={formOnSubmitHandler}>
                  <CCol md={3}>
                    <CFormInput
                      name="NIS"
                      type="text"
                      id="inputNIS"
                      label="NIS"
                      onChange={formOnChangeHandler}
                    />
                  </CCol>
                  <CCol md={9}>
                    <CFormInput
                      name="namaPeminjam"
                      type="text"
                      id="inputNamaPeminjam"
                      label="Nama Peminjam"
                      value={addFormData.namaPeminjam || ''}
                      // onChange={formOnChangeHandler}
                      readOnly
                    />
                  </CCol>
                  <CCol md={2}>
                    <CFormInput
                      name="kodeBuku"
                      type="text"
                      id="inputKodeBuku"
                      label="Kode Buku"
                      onChange={formOnChangeHandler}
                      // onBlur={fetchJudulBuku}
                    />
                  </CCol>
                  <CCol xs={10}>
                    <CFormInput
                      name="judulBuku"
                      id="inputJudulBuku"
                      label="Judul Buku"
                      value={addFormData.judulBuku || ''}
                      placeholder="Judul Buku"
                      readOnly
                    />
                  </CCol>
                  <CCol md={4}>
                    <CDatePicker
                      name="tglPinjam"
                      footer
                      locale="en-US"
                      id="tglPinjam"
                      label="Tanggal Pinjam"
                      onDateChange={formOnChangeTglPinjam}
                    />
                  </CCol>
                  <CCol md={4}>
                    <CDatePicker
                      name="batasPinjam"
                      footer
                      locale="en-US"
                      id="batasPinjam"
                      label="Batas Pinjam"
                      onDateChange={formOnChangeBatasPinjam}
                    />
                  </CCol>
                  <CCol md={4}>
                    <CDatePicker
                      name="tglKembali"
                      footer
                      locale="en-US"
                      id="tglKembali"
                      label="Tanggal Kembali"
                      onDateChange={formOnChangeTglKembali}
                    />
                  </CCol>
                  <CCol md={8}>
                    <CFormSelect
                      name="status"
                      id="inputStatus"
                      label="Status"
                      value={addFormData.status}
                      onChange={formOnChangeHandler}
                      text="* Pilih Status"
                    >
                      <option>Belum Dikembalikan</option>
                      <option>Dikembalikan</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={4}>
                    <CFormInput
                      name="denda"
                      id="inputDenda"
                      label="Denda"
                      onChange={formOnChangeHandler}
                    />
                  </CCol>
                  <CModalFooter>
                    <CButton type="submit"> Tambah </CButton>
                    <CButton
                      color="light"
                      onClick={() => {
                        batalHandler()
                      }}
                    >
                      {' '}
                      Kembali{' '}
                    </CButton>
                  </CModalFooter>
                </CForm>
              </CModalBody>
            </CModal>

            <CButton
              color="primary"
              className="mb-2 download"
              href={csvCode}
              download="data-peminjaman.csv"
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
              columnSorter
              items={peminjaman}
              itemsPerPageSelect
              itemsPerPage={5}
              pagination
              scopedColumns={{
                status: (item) => (
                  <td>
                    <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
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
                          toggleDetails(item.idPeminjaman)
                        }}
                      >
                        {details.includes(item.idPeminjaman) ? 'Hide' : 'Show'}
                      </CButton>
                    </td>
                  )
                },
                details: (item) => {
                  return (
                    <CCollapse visible={details.includes(item.idPeminjaman)}>
                      <CCardBody className="p-3">
                        <h4>Buku {item.judulBuku}</h4>
                        <p className="text-muted">Dipinjam Sejak: {item.tglPinjam}</p>
                        <CButton
                          size="sm"
                          color="primary"
                          onClick={() => {
                            toggleUpdate(item.idPeminjaman)
                          }}
                        >
                          Edit
                        </CButton>
                        <CButton
                          size="sm"
                          color="dark"
                          onClick={() => OnChangeKembali(item.idPeminjaman)}
                        >
                          Dikembalikan
                        </CButton>
                        <CButton
                          size="sm"
                          color="danger"
                          onClick={() => handleDelete(item.idPeminjaman)}
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
                // striped: true,
                hover: true,
              }}
            />
          </CCardBody>
        </CCard>

        <CModal
          allignment="center"
          size="lg"
          scrollable
          visible={openModalUpdate}
          onClose={() => batalHandler()}
        >
          <CModalHeader>
            <CModalTitle> Edit Data Peminjaman</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className="row g-3" onSubmit={formUpdateHandler}>
              <CCol md={3}>
                <CFormInput
                  value={currentId.NIS}
                  name="NIS"
                  type="text"
                  id="inputNIS"
                  label="NIS"
                  onChange={formUpdateChangeHandler}
                />
              </CCol>
              <CCol md={9}>
                <CFormInput
                  value={currentId.namaPeminjam}
                  name="namaPeminjam"
                  type="text"
                  id="inputNamaPeminjam"
                  label="Nama Peminjam"
                  onChange={formUpdateChangeHandler}
                />
              </CCol>
              <CCol md={2}>
                <CFormInput
                  value={currentId.kodeBuku}
                  name="kodeBuku"
                  type="text"
                  id="inputIdBuku"
                  label="Kode Buku"
                  onChange={formUpdateChangeHandler}
                />
              </CCol>
              <CCol xs={10}>
                <CFormInput
                  value={currentId.judulBuku}
                  name="judulBuku"
                  id="inputJudulBuku"
                  label="Judul Buku"
                  placeholder="Judul Buku"
                  onChange={formUpdateChangeHandler}
                />
              </CCol>
              <CCol md={4}>
                <CDatePicker
                  date={currentId.tglPinjam}
                  name="tglPinjam"
                  footer
                  locale="en-US"
                  id="tglPinjam"
                  label="Tanggal Pinjam"
                  onDateChange={(date) => {
                    formOnChangeDateHandler('tglPinjam', date)
                  }}
                />
              </CCol>
              <CCol md={4}>
                <CDatePicker
                  date={currentId.batasPinjam}
                  name="batasPinjam"
                  footer
                  locale="en-US"
                  id="batasPinjam"
                  label="Batas Pinjam"
                  onDateChange={(date) => {
                    formOnChangeDateHandler('batasPinjam', date)
                  }}
                />
              </CCol>
              <CCol md={4}>
                <CDatePicker
                  date={currentId.tglKembali}
                  name="tglKembali"
                  footer
                  locale="en-US"
                  id="tglKembali"
                  label="Tanggal Kembali"
                  onDateChange={(date) => {
                    formOnChangeDateHandler('tglKembali', date)
                  }}
                />
              </CCol>
              <CCol md={8}>
                <CFormSelect
                  value={currentId.status}
                  name="status"
                  id="inputStatus"
                  label="Status"
                  onChange={formUpdateChangeHandler}
                  text="* Pilih Status"
                >
                  <option>Belum Dikembalikan</option>
                  <option>Dikembalikan</option>
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormInput
                  value={currentId.denda}
                  name="denda"
                  id="inputDenda"
                  label="Denda"
                  onChange={formUpdateChangeHandler}
                />
              </CCol>
              <CModalFooter>
                <CButton type="submit"> Simpan </CButton>
                <CButton
                  color="light"
                  onClick={() => {
                    batalHandler()
                  }}
                >
                  {' '}
                  Kembali{' '}
                </CButton>
              </CModalFooter>
            </CForm>
          </CModalBody>
        </CModal>
      </>
    )
  } catch (e) {
    alert(e.message)
  }
}

export default AdminPeminjaman
