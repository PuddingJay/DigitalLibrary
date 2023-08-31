/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react'
import './AdminDaftarPustaka.scss'
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

const Kategori = () => {
  const [loading, setLoading] = useState()
  const [DataKategori, setDataKategori] = useState([])
  const [nama, setnama] = useState([])
  const [modalTambah, setModalTambah] = useState(false)
  const [modalUpdate, setModalUpdate] = useState(false)
  const [idKategori, setidKategori] = useState(null)

  const formRef = useRef(null)

  useEffect(() => {
    fetchData()
    setLoading(false)
  }, [])

  const toggleModalTambah = () => {
    setnama('')
    setModalTambah(!modalTambah)
  }

  const toggleModalUpdate = () => {
    setModalUpdate(!modalUpdate)
  }

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3005/kategori')
      setDataKategori(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAdd = (e) => {
    e.preventDefault()

    const formData = { nama }

    axios
      .post('http://localhost:3005/kategori', formData)
      .then(() => {
        toggleModalTambah()
        fetchData()
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleDelete = async (idKategori) => {
    try {
      await axios.delete(`http://localhost:3005/kategori/${idKategori}`)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async () => {
    const formData = { nama }

    try {
      await axios.put(`http://localhost:3005/kategori/${idKategori}`, formData)
      toggleModalUpdate()
      fetchData()

      // Perbarui data buku yang sudah dirubah dengan data baru
      setDataKategori((prevData) => {
        return prevData.map((item) => {
          if (item.idKategori === idKategori) {
            return {
              ...item,
              nama: nama,
            }
          }
          return item
        })
      })

      // Setel ulang nilai input menjadi kosong atau nilai default
      setnama('')
    } catch (error) {
      console.error(error)
    }
  }

  const toggleModal = (idKategori) => {
    const kategorifull = DataKategori.find((item) => item.idKategori === idKategori)
    setidKategori(kategorifull.idKategori) // Set the idKategori value as the idKategori

    setnama(kategorifull.nama)
    setModalUpdate(!modalUpdate)
  }

  const [details, setDetails] = useState([])
  const columns = [
    {
      key: 'idKategori',
      _style: { width: '18%' },
    },
    { key: 'nama', _style: { width: '50%' } },

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
  const csvContent = DataKategori.map((item) => Object.values(item).join(',')).join('\n')
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent)

  try {
    return (
      <>
        <CCard>
          <CCardBody>
            <div className="actionDataKategori">
              <CButton color="primary" size="lg" className="btnModal" onClick={toggleModalTambah}>
                Tambah Kategori Baru
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
              <ModalHeader toggle={toggleModalTambah}>Tambah Kategori</ModalHeader>
              <ModalBody>
                <Form innerRef={formRef}>
                  <FormGroup>
                    <Label for="nama">Masukkan nama Kategori</Label>
                    <Input
                      type="text"
                      name="nama"
                      id="nama"
                      value={nama}
                      onChange={(e) => setnama(e.target.value)}
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
                Form {idKategori ? 'Edit' : 'Edit'} Data
              </ModalHeader>
              <ModalBody>
                <Form innerRef={formRef}>
                  <FormGroup>
                    <Label for="nama">Nama Kategori</Label>
                    <Input
                      type="text"
                      name="nama"
                      id="nama"
                      value={nama}
                      onChange={(e) => setnama(e.target.value)}
                    />
                  </FormGroup>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  color="primary"
                  onClick={idKategori ? () => handleUpdate(idKategori) : handleAdd}
                >
                  Simpan
                </Button>
                <Button color="secondary" onClick={toggleModalUpdate}>
                  Batal
                </Button>
              </ModalFooter>
            </Modal>

            <CSmartTable
              className="mt-3"
              activePage={3}
              footer
              cleaner
              clickableRows
              columns={columns}
              columnSorter
              loading={loading}
              items={DataKategori}
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
                          toggleDetails(item.idKategori)
                        }}
                      >
                        {details.includes(item.idKategori) ? 'Hide' : 'Show'}
                      </CButton>
                    </td>
                  )
                },
                details: (item) => {
                  return (
                    <CCollapse visible={details.includes(item.idKategori)}>
                      <CCardBody className="p-3">
                        <h4>{item.nama}</h4>
                        <p className="text-muted">
                          Kelas {item.Kelas} {item.Jurusan}
                        </p>
                        <CButton
                          size="sm"
                          color="primary"
                          onClick={() => {
                            toggleModal(item.idKategori)
                          }}
                        >
                          Edit
                        </CButton>
                        <CButton
                          size="sm"
                          color="danger"
                          onClick={() => handleDelete(item.idKategori)}
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
      </>
    )
  } catch (e) {
    alert(e.message)
  }
}

export default Kategori
