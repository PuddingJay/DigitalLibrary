import React, { useState, useEffect, useRef } from 'react'
import '../admin-dataAnggota/AdminDataAnggota.scss'
import {
  CButton,
  CCard,
  CCardBody,
  CCollapse,
  CSmartTable,
  CAlert,
  CFormSelect,
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

const AdminDataAnggota = () => {
  const [loading, setLoading] = useState()
  const [DataAnggota, setDataAnggota] = useState([])
  const [NIS, setNIS] = useState([])
  const [Nama, setNama] = useState([])
  const [Kelas, setKelas] = useState([])
  const [currentAnggotaId, setCurrentAnggotaId] = useState(null)
  const [Jurusan, setJurusan] = useState([])

  const [selectedFile, setSelectedFile] = useState(null)
  const [jsonData, setJsonData] = useState('')

  const [msg, setMsg] = useState(null)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  const formRef = useRef(null)

  useEffect(() => {
    fetchData()
    setLoading(false)
  }, [])

  const [modalTambah, setModalTambah] = useState(false)
  const [modalUpdate, setModalUpdate] = useState(false)
  const [modalImport, setModalImport] = useState(false)
  const toggleModalTambah = () => {
    setNIS('')
    setNama('')
    setKelas('')
    setJurusan('')

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

    const formData = { NIS, Nama, Kelas, Jurusan }
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
    const formData = { NIS, Nama, Kelas, Jurusan }

    try {
      const response = await axios.put(`http://localhost:3005/siswa/${currentAnggotaId}`, formData)
      toggleModalUpdate()
      fetchData()

      setMsg(response.data.message)
      setShowSuccessAlert(true)

      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)

      // Perbarui data buku yang sudah dirubah dengan data baru
      setDataAnggota((prevData) => {
        return prevData.map((item) => {
          if (item.NIS === currentAnggotaId) {
            return {
              ...item,
              NIS: NIS,
              Nama: Nama,
              Kelas: Kelas,
              Jurusan: Jurusan,
            }
          }
          return item
        })
      })

      // Setel ulang nilai input menjadi kosong atau nilai default
      setNIS('')
      setNama('')
      setKelas('')
      setJurusan('')
    } catch (error) {
      console.error(error)
    }
  }

  const toggleModal = (NIS) => {
    const siswa = DataAnggota.find((item) => item.NIS === NIS)
    setCurrentAnggotaId(siswa.NIS) // Set the NIS value as the currentAnggotaId
    setNIS(siswa.NIS)
    setNama(siswa.Nama)
    setKelas(siswa.Kelas)
    setJurusan(siswa.Jurusan)
    setModalUpdate(!modalUpdate)
  }

  const [details, setDetails] = useState([])
  const columns = [
    {
      key: 'NIS',
      _style: { width: '18%' },
    },
    { key: 'Nama', _style: { width: '50%' } },
    { key: 'Kelas', _style: { width: '18%' } },
    { key: 'Jurusan', _style: { width: '18%' } },
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

  const csvContent = DataAnggota.map(getCsvRow).join('\n')
  const csvCode =
    'data:text/csv;charset=utf-8,' + encodeURIComponent(getCsvHeader() + '\n' + csvContent)

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
          setJsonData(response.data)
        } else {
          console.error('Converted data is not in the expected format:', response.data)
        }
      })
      .catch((error) => {
        console.error('Error converting file:', error)
        alert(error.response.data.error.message)
      })
    console.log(jsonData)
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
                color="primary"
                href={csvCode}
                download="data-anggota.csv"
                target="_blank"
                size="lg"
              >
                <CIcon icon={cilCloudDownload} size="lg" />
                {/* Download data peminjaman (.csv) */}
              </CButton>
            </div>

            <CSmartTable
              className="mt-3"
              activePage={3}
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
                show_details: (item) => {
                  return (
                    <td className="py-2">
                      <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => {
                          toggleDetails(item.NIS)
                        }}
                      >
                        {details.includes(item.NIS) ? 'Hide' : 'Show'}
                      </CButton>
                    </td>
                  )
                },
                details: (item) => {
                  return (
                    <CCollapse visible={details.includes(item.NIS)}>
                      <CCardBody className="p-3">
                        <h4>{item.Nama}</h4>
                        <p className="text-muted">
                          Kelas {item.Kelas} {item.Jurusan}
                        </p>
                        <CButton
                          size="sm"
                          color="primary"
                          onClick={() => {
                            toggleModal(item.NIS)
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

        <CModal alignment="center" visible={modalTambah} toggle={toggleModalTambah}>
          <ModalHeader toggle={toggleModalTambah}>Tambah Anggota</ModalHeader>
          <ModalBody>
            <Form innerRef={formRef}>
              <FormGroup>
                <Label for="NIS">NIS</Label>
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
                  value={Nama}
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
              <FormGroup>
                <CFormSelect
                  name="Kelas"
                  id="Kelas"
                  type="text"
                  label="Kelas"
                  value={Kelas}
                  onChange={(e) => setKelas(e.target.value)}
                >
                  <option>Open this select menu</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                </CFormSelect>
              </FormGroup>
              <FormGroup>
                <Label for="Jurusan">Jurusan</Label>
                <Input
                  type="text"
                  name="Jurusan"
                  placeholder="[Jurusan]-[ruang] Contoh: IPA-1"
                  id="Jurusan"
                  value={Jurusan}
                  onChange={(e) => setJurusan(e.target.value)}
                />
              </FormGroup>
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
            <Form innerRef={formRef}>
              <FormGroup>
                <Label for="NIS">NIS</Label>
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
                  value={Nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="Kelas">Kelas</Label>
                <CFormSelect
                  type="text"
                  name="Kelas"
                  id="Kelas"
                  value={Kelas}
                  onChange={(e) => setKelas(e.target.value)}
                >
                  <option>Open this select menu</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                </CFormSelect>
              </FormGroup>
              <FormGroup>
                <Label for="Jurusan">Jurusan</Label>
                <Input
                  type="text"
                  name="Jurusan"
                  placeholder="IPA-1"
                  id="Jurusan"
                  value={Jurusan}
                  onChange={(e) => setJurusan(e.target.value)}
                />
              </FormGroup>
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
