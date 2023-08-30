import React, { useState, useEffect } from 'react'
import '../admin-dataAnggota/AdminDataAnggota.scss'
import {
  CButton,
  CCard,
  CCardBody,
  CCollapse,
  CSmartTable,
  CAlert,
  // CFormSelect,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CFormTextarea,
  CFormInput,
} from '@coreui/react-pro'
import axios from 'axios'
import {
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap'
import { cilCloudDownload, cilCheckCircle, cilCloudUpload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import * as XLSX from 'xlsx'
import jwtDecode from 'jwt-decode'

const AdminDataAnggota = () => {
  const [loading, setLoading] = useState()
  const [DataAnggota, setDataAnggota] = useState([])
  const [NIS, setNIS] = useState([])
  const [nama, setNama] = useState([])
  // const [Kelas, setKelas] = useState([])
  const [currentAnggotaId, setCurrentAnggotaId] = useState(null)
  // const [Jurusan, setJurusan] = useState([])

  const [selectedFile, setSelectedFile] = useState(null)
  const [jsonData, setJsonData] = useState('')

  const [msg, setMsg] = useState(null)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  useEffect(() => {
    fetchData()
    setLoading(false)
    RefreshToken()
  }, [])

  const RefreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      const response = await axios.get(`http://localhost:3005/token/${refreshToken}`)
      const decoded = jwtDecode(response.data.accessToken)

      if (decoded.role !== 'admin') {
        window.location.href = '/dashboard' // Ganti '/dashboard' dengan rute yang sesuai
        alert('Anda tidak punya akses untuk halaman ini')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const [modalTambah, setModalTambah] = useState(false)
  const [modalUpdate, setModalUpdate] = useState(false)
  const [modalImport, setModalImport] = useState(false)
  const toggleModalTambah = () => {
    setNIS('')
    setNama('')
    // setKelas('')
    // setJurusan('')

    setModalTambah(!modalTambah)
  }

  const toggleModalUpdate = () => {
    setModalUpdate(!modalUpdate)
  }

  const toggleModalImport = () => {
    setModalImport(!modalImport)
    setJsonData('')
  }

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3005/siswa')
      setDataAnggota(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()

    const formData = { NIS, nama }
    try {
      const response = await axios.post('http://localhost:3005/siswa', formData)
      toggleModalTambah()
      fetchData()
      setMsg(response.data.message)
      setShowSuccessAlert(true)

      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message)
      } else {
        console.error(error)
      }
    }
  }

  const handleDelete = async (NIS) => {
    try {
      const response = await axios.delete(`http://localhost:3005/siswa/${NIS}`)
      fetchData()
      setMsg(response.data.message)
      setShowSuccessAlert(true)

      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async () => {
    const formData = { NIS, nama }

    try {
      const response = await axios.put(`http://localhost:3005/siswa/${currentAnggotaId}`, formData)
      toggleModalUpdate()
      fetchData()

      setMsg(response.data.message)
      setShowSuccessAlert(true)

      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)

      setDataAnggota((prevData) => {
        return prevData.map((item) => {
          if (item.NIS === currentAnggotaId) {
            return {
              ...item,
              NIS: NIS,
              Nama: nama,
            }
          }
          return item
        })
      })

      setNIS('')
      setNama('')
      // setKelas('')
      // setJurusan('')
    } catch (error) {
      console.error(error)
    }
  }

  const toggleModal = (NIS) => {
    const siswa = DataAnggota.find((item) => item.siswa_NIS === NIS)
    console.log(siswa)
    setCurrentAnggotaId(siswa.siswa_NIS)
    setNIS(siswa.siswa_NIS)
    setNama(siswa.nama)
    // setKelas(siswa.Kelas)
    // setJurusan(siswa.Jurusan)
    setModalUpdate(!modalUpdate)
  }

  const [details, setDetails] = useState([])
  const columns = [
    {
      key: 'No',
      _style: { width: '5%' },
      filter: false,
      sorter: false,
    },
    { key: 'siswa_NIS', _style: { width: '18%' }, label: 'NIS/ID' },
    { key: 'nama', _style: { width: '25%' } },
    { key: 'status', _style: { width: '10%' }, label: 'Status Anggota' },
    { key: 'jumlahPinjam', _style: { width: '12%' } },
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

  const getExcelData = () => {
    if (!DataAnggota || !DataAnggota[0]) {
      alert('Tidak bisa download data kosong')
      return new Blob()
    }
    const header = Object.keys(DataAnggota[0])
    const data = DataAnggota.map((item) => header.map((column) => item[column]))

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
      link.download = 'data-anggota.xlsx'
      link.click()
    }
  }

  // import excel
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
    setJsonData('')
  }

  const handleFileConvert = () => {
    if (!selectedFile) {
      alert('Masukkan file terlebih dahulu.')
      return
    }

    const formData = new FormData()
    formData.append('excelFile', selectedFile)

    axios
      .post('http://localhost:3005/import-excel', formData)
      .then((response) => {
        if (Array.isArray(response.data)) {
          const transformedData = response.data.map((item) => ({
            NIS: item.NIS || item.nis || item.Nis,
            nama: item.Nama || item.NAMA || item.nama,
          }))
          setJsonData(transformedData)
          console.log(transformedData)
        } else {
          console.error('Converted data is not in the expected format:', response.data)
        }
        console.log(response)
      })
      .catch((error) => {
        console.error('Error converting file:', error)
        alert(error.response.data.error.message)
      })
  }

  // post hasil convert ke tabel data
  const handlePostExcel = async () => {
    try {
      if (!jsonData.length) {
        console.error('jsonData is empty or not in the expected format.')
        return
      }

      const response = await axios.post('http://localhost:3005/siswa-from-excel', jsonData)
      toggleModalImport()
      fetchData()
      setMsg(response.data.message)
      setShowSuccessAlert(true)

      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          alert(
            'Terjadi kesalahan saat menambahkan siswa. Silakan periksa data input dan coba lagi.',
          )
        } else {
          alert('Terjadi kesalahan. Silakan periksa data input dan coba lagi.')
        }
      } else {
        alert('Terjadi kesalahan. Periksa koneksi jaringan dan data input dan coba lagi.')
      }
    }
  }

  // const options = ['Open this select menu', '10', '11', '12', 'Guru', 'Umum']
  // const handleNaikKelas = async () => {
  //   try {
  //     const response = await axios.put('http://localhost:3005/siswa-naik-kelas')
  //     if (response && response.data) {
  //       setMsg(response.data)
  //     } else {
  //       console.error('Tidak ada data yang dapat diolah')
  //       setMsg('Gagal mengubah nilai kelas')
  //     }
  //     fetchData()
  //   } catch (err) {
  //     console.error(err)
  //     if (err.response && err.response.data && err.response.data.error) {
  //       setMsg(err.response.data.error)
  //     } else {
  //       setMsg('Gagal mengubah nilai kelas')
  //     }
  //   }
  // }

  try {
    return (
      <>
        {showSuccessAlert && (
          <CAlert color="success" className="d-flex align-items-center">
            <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
            <div>{msg}</div>
          </CAlert>
        )}
        <CCard>
          <CCardBody>
            <div className="actionDataAnggota">
              <div className="form-container">
                <CButton color="primary" size="lg" className="btnModal" onClick={toggleModalTambah}>
                  Tambah Data Anggota
                </CButton>
                {/* <CButton
                  color="primary"
                  size="lg"
                  variant="outline"
                  className="btnNaikKelas"
                  onClick={() => {
                    const naikKelas = window.confirm('Konfirmasi Kenaikan Kelas')
                    if (naikKelas) {
                      handleNaikKelas()
                    }
                  }}
                >
                  Naik Kelas
                </CButton> */}
                <CButton
                  color="primary"
                  size="lg"
                  className="importCsv"
                  onClick={() => {
                    toggleModalImport()
                  }}
                >
                  <CIcon icon={cilCloudUpload} size="lg" />
                  {` `} Import Excel/CSV
                </CButton>
              </div>
              <CButton
                className="download-button"
                color="primary"
                onClick={downloadExcel}
                target="_blank"
                size="lg"
              >
                <CIcon icon={cilCloudDownload} size="lg" />
                {/* Download data peminjaman (.csv) */}
              </CButton>
            </div>

            <CSmartTable
              className="mt-3"
              activePage={1}
              footer
              cleaner
              clickableRows
              columns={columns}
              columnSorter
              loading={loading}
              items={DataAnggota}
              itemsPerPageSelect
              itemsPerPage={5}
              pagination
              scopedColumns={{
                No: (item, index) => {
                  const itemNumber = index + 1
                  return <td>{itemNumber}</td>
                },
                show_details: (item) => {
                  return (
                    <td className="py-2">
                      <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => {
                          toggleDetails(item.siswa_NIS)
                        }}
                      >
                        {details.includes(item.siswa_NIS) ? 'Hide' : 'Show'}
                      </CButton>
                    </td>
                  )
                },
                details: (item) => {
                  return (
                    <CCollapse visible={details.includes(item.siswa_NIS)}>
                      <CCardBody className="p-3">
                        <h4>Nama: {item.nama}</h4>
                        {/* <p className="text-muted">
                          Kelas {item.Kelas} {item.Jurusan}
                        </p> */}
                        <CButton
                          size="sm"
                          color="primary"
                          onClick={() => {
                            toggleModal(item.siswa_NIS)
                          }}
                        >
                          Edit
                        </CButton>
                        <CButton
                          size="sm"
                          color="danger"
                          onClick={() => {
                            const shouldDelete = window.confirm(
                              'Apakah Anda yakin ingin menghapus data ini?',
                            )
                            if (shouldDelete) {
                              handleDelete(item.NIS)
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
              sorterValue={{
                column: 'name',
                state: 'asc',
              }}
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

        <CModal alignment="center" visible={modalTambah} toggle={toggleModalTambah}>
          <ModalHeader toggle={toggleModalTambah}>Tambah Anggota</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="NIS">NIS/ID</Label>
                <Input
                  type="text"
                  name="NIS"
                  id="NIS"
                  value={NIS}
                  onChange={(e) => setNIS(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="Nama">Nama Lengkap</Label>
                <Input
                  type="text"
                  name="Nama"
                  id="Nama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  type="text"
                  name="password"
                  id="password"
                  value={NIS}
                  onChange={(e) => setNIS(e.target.value)}
                />
              </FormGroup>
              {/* <FormGroup>
                <CFormSelect
                  name="Kelas"
                  id="Kelas"
                  type="text"
                  label="Kelas/Peran"
                  value={Kelas}
                  onChange={(e) => setKelas(e.target.value)}
                >
                  {options.map((option, index) => (
                    <option key={index}>{option}</option>
                  ))}
                </CFormSelect>
              </FormGroup> */}
              {/* <FormGroup>
                <Label for="Jurusan">Jurusan/Ruang</Label>
                <Input
                  type="text"
                  name="Jurusan"
                  placeholder="[Jurusan]-[ruang] Contoh: IPA-1"
                  id="Jurusan"
                  value={Jurusan}
                  onChange={(e) => setJurusan(e.target.value)}
                />
              </FormGroup> */}
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="primary" onClick={handleAdd}>
              Simpan
            </Button>
            <Button color="secondary" onClick={toggleModalTambah}>
              Batal
            </Button>
          </ModalFooter>
        </CModal>

        <CModal alignment="center" visible={modalUpdate}>
          <ModalHeader toggle={toggleModalUpdate}>
            Form {currentAnggotaId ? 'Edit' : 'Edit'} Data
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="NIS">NIS/ID</Label>
                <Input
                  type="text"
                  name="NIS"
                  id="NIS"
                  value={NIS}
                  onChange={(e) => setNIS(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="Nama">Nama Lengkap</Label>
                <Input
                  type="text"
                  name="Nama"
                  id="Nama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </FormGroup>
              {/* <FormGroup>
                <Label for="Kelas">Kelas/Peran</Label>
                <CFormSelect
                  type="text"
                  name="Kelas"
                  id="Kelas"
                  value={Kelas}
                  onChange={(e) => setKelas(e.target.value)}
                >
                  {options.map((option, index) => (
                    <option key={index}>{option}</option>
                  ))}
                </CFormSelect>
              </FormGroup>
              <FormGroup>
                <Label for="Jurusan">Jurusan/Ruang</Label>
                <Input
                  type="text"
                  name="Jurusan"
                  placeholder="IPA-1"
                  id="Jurusan"
                  value={Jurusan}
                  onChange={(e) => setJurusan(e.target.value)}
                />
              </FormGroup> */}
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              color="primary"
              onClick={currentAnggotaId ? () => handleUpdate(currentAnggotaId) : handleAdd}
            >
              Simpan
            </Button>
            <Button color="light" onClick={toggleModalUpdate}>
              Batal
            </Button>
          </ModalFooter>
        </CModal>

        <CModal alignment="center" size="lg" scrollable visible={modalImport}>
          <CModalHeader>
            <CModalTitle>Import Excel/CSV</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="convert">
              <CFormInput type="file" onChange={handleFileChange} />
              <CButton onClick={handleFileConvert}>Convert to JSON</CButton>
            </div>
            <CFormTextarea
              id="exampleFormControlTextarea1"
              className="mt-3"
              rows={15}
              value={JSON.stringify(jsonData, null, 2)}
              readOnly
            ></CFormTextarea>
          </CModalBody>
          <CModalFooter>
            <CButton type="submit" onClick={handlePostExcel}>
              {' '}
              Tambah{' '}
            </CButton>
            <CButton color="light" onClick={toggleModalImport}>
              {' '}
              Kembali{' '}
            </CButton>
          </CModalFooter>
        </CModal>
      </>
    )
  } catch (e) {
    alert(e.message)
  }
}

export default AdminDataAnggota
