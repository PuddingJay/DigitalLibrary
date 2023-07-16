import React, { useState, useEffect, useRef } from 'react'
import '../admin-dataAnggota/AdminDataAnggota.scss'
import { CButton, CCard, CCardBody, CCollapse, CSmartTable } from '@coreui/react-pro'
import axios from 'axios'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap'
import { cilCloudDownload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const AdminDataAnggota = () => {
  const [loading, setLoading] = useState()
  const [DataAnggota, setDataAnggota] = useState([])
  const [NIS, setNIS] = useState([])
  const [password] = useState([])
  const [Nama, setNama] = useState([])
  const [Kelas, setKelas] = useState([])
  const [Jurusan, setJurusan] = useState([])
  const [modalTambah, setModalTambah] = useState(false)
  const [modalUpdate, setModalUpdate] = useState(false)
  const [currentAnggotaId, setCurrentAnggotaId] = useState(null)

  const formRef = useRef(null)

  useEffect(() => {
    fetchData()
    setLoading(false)
  }, [])

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

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3005/siswa')
      setDataAnggota(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAdd = (e) => {
    e.preventDefault()

    const formData = { NIS, Nama, Kelas, Jurusan }

    axios
      .post('http://localhost:3005/siswa', formData)
      .then(() => {
        toggleModalTambah()
        fetchData()
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleDelete = async (NIS) => {
    try {
      await axios.delete(`http://localhost:3005/siswa/${NIS}`)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async () => {
    const formData = { NIS, Nama, Kelas, Jurusan }

    try {
      await axios.put(`http://localhost:3005/siswa/${currentAnggotaId}`, formData)
      toggleModalUpdate()
      fetchData()

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
  const csvContent = DataAnggota.map((item) => Object.values(item).join(',')).join('\n')
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent)

  try {
    return (
      <>
        <CCard>
          <CCardBody>
            <div className="actionDataAnggota">
              <CButton color="primary" size="lg" className="btnModal" onClick={toggleModalTambah}>
                Tambah Data Anggota
              </CButton>
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
            <Modal isOpen={modalTambah} toggle={toggleModalTambah}>
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
                    <Label for="Kelas">Kelas</Label>
                    <Input
                      type="text"
                      placeholder="contoh 10"
                      name="Kelas"
                      id="Kelas"
                      value={Kelas}
                      onChange={(e) => setKelas(e.target.value)}
                    />
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
                <Button type="submit" color="primary" onClick={handleAdd}>
                  Simpan
                </Button>
                <Button color="secondary" onClick={toggleModalTambah}>
                  Batal
                </Button>
              </ModalFooter>
            </Modal>

            <Modal isOpen={modalUpdate} toggle={toggleModalUpdate}>
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
                    <Input
                      type="text"
                      placeholder="contoh 10"
                      name="Kelas"
                      id="Kelas"
                      value={Kelas}
                      onChange={(e) => setKelas(e.target.value)}
                    />
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
                <Button color="secondary" onClick={toggleModalUpdate}>
                  Batal
                </Button>
              </ModalFooter>
            </Modal>

            <CButton
              color="primary"
              className="mb-2 download"
              href={csvCode}
              download="data-anggota.csv"
              target="_blank"
              size="lg"
            >
              <CIcon icon={cilCloudDownload} size="lg" />
              {/* Download data peminjaman (.csv) */}
            </CButton>

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
                        <CButton size="sm" color="danger" onClick={() => handleDelete(item.NIS)}>
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
      </>
    )
  } catch (e) {
    alert(e.message)
  }
}

export default AdminDataAnggota
