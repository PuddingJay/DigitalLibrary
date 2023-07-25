// import './AdminDaftarPustaka.scss';
import React, { useState, useEffect, useRef } from 'react'
import '../admin-dataAnggota/AdminDataAnggota.scss'
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
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import { Link } from 'react-router-dom'

const AdminDaftarPustaka = () => {
  const [loading, setLoading] = useState()
  const [DaftarPustaka, setDaftarPustaka] = useState([])
  const [kodeBuku, setKodeBuku] = useState('')
  const [judul, setJudul] = useState('')
  const [penulis, setPenulis] = useState('')
  const [Kategori, setKategori] = useState('')
  const [tahun_terbit, setTahun_terbit] = useState('')
  const [keterangan, setKeterangan] = useState('')
  const [jumlah, setJumlah] = useState('')
  const [cover_buku, setCover_buku] = useState(null)
  const [file_ebook, setfile_ebook] = useState(null)
  const [modalTambah, setModalTambah] = useState(false)
  const [modalUpdate, setModalUpdate] = useState(false)
  const [currentBookId, setCurrentBookId] = useState('')

  const formRef = useRef(null)

  useEffect(() => {
    fetchData()
    setLoading(false)
  }, [])

  const toggleModalTambah = () => {
    setKodeBuku('')
    setJudul('')
    setPenulis('')
    setKategori('')
    setTahun_terbit('')
    setKeterangan('')
    setJumlah('')
    setCover_buku('')
    setfile_ebook('')

    setModalTambah(!modalTambah)
  }

  const toggleModalUpdate = () => {
    setModalUpdate(!modalUpdate)
  }

  const fetchData = async () => {
    try {
      const response = await axios.get('https://api2.librarysmayuppentek.sch.id/book')
      setDaftarPustaka(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAdd = (e) => {
    e.preventDefault()

    const formData = new FormData(formRef.current)
    cover_buku?.files && formData.append('cover_buku', cover_buku.files[0])
    file_ebook?.files && formData.append('file_ebook', file_ebook.files[0])
    console.log(formData)

    axios
      .post('https://api2.librarysmayuppentek.sch.id/book', formData)
      .then(() => {
        toggleModalTambah()
        console.log(formData)
        fetchData()
        console.log(formData)
      })
      .catch((error) => {
        console.error(error)
      })
    console.log(formData)
  }

  const handleDelete = async (idBuku) => {
    try {
      await axios.delete(`https://api2.librarysmayuppentek.sch.id/book/${idBuku}`)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async () => {
    const formData = new FormData(formRef.current)

    cover_buku?.files && formData.append('cover_buku', cover_buku.files[0])
    file_ebook?.files && formData.append('cover_buku', file_ebook.files[0])
    console.log('after', formData)
    try {
      await axios.put(`https://api2.librarysmayuppentek.sch.id/book/${currentBookId}`, formData)
      toggleModalUpdate()
      fetchData()

      // Perbarui data buku yang sudah dirubah dengan data baru
      setDaftarPustaka((prevData) => {
        return prevData.map((item) => {
          if (item.kodeBuku === currentBookId) {
            return {
              ...item,
              kodeBuku: kodeBuku || item.kodeBuku,
              judul: judul || item.judul,
              penulis: penulis || item.penulis,
              Kategori: Kategori || item.Kategori,
              tahun_terbit: tahun_terbit || item.tahun_terbit,
              keterangan: keterangan || item.keterangan,
              jumlah: jumlah || item.jumlah,
              cover_buku: cover_buku?.files[0]?.name || item.cover_buku,
              file_ebook: file_ebook?.files[0]?.name || item.file_ebook,
            }
          }
          console.log(item)
          return item
        })
      })

      // Setel ulang nilai input menjadi kosong atau nilai default
      setKodeBuku('')
      setJudul('')
      setPenulis('')
      setKategori('')
      setTahun_terbit('')
      setKeterangan('')
      setJumlah('')
      setCover_buku(null)
      setfile_ebook(null)
    } catch (error) {
      console.error(error)
    }
  }

  const toggleModal = (kodeBuku) => {
    const book = DaftarPustaka.find((item) => item.kodeBuku === kodeBuku)
    setCurrentBookId(book)
    setKodeBuku(book.kodeBuku)
    setJudul(book.judul)
    setPenulis(book.penulis)
    setKategori(book.Kategori)
    setTahun_terbit(book.tahun_terbit)
    setKeterangan(book.keterangan)
    setJumlah(book.jumlah)
    setCover_buku(null)
    setfile_ebook(null)
    setModalUpdate(!modalUpdate)
  }

  const [details, setDetails] = useState([])
  const columns = [
    {
      key: 'kodeBuku',
      _style: { width: '12%' },
    },
    { key: 'judul', _style: { width: '17%' } },
    { key: 'penulis', _style: { width: '20%' } },
    { key: 'Kategori', _style: { width: '10%' } },
    { key: 'keterangan', _style: { width: '10%' } },
    { key: 'jumlah', _style: { width: '5%' } },
    { key: 'tersedia', _style: { width: '5%' } },
    {
      key: 'cover_buku',
      _style: { width: '10%' },
      formatter: (item) => (
        // <img src={`https://api2.librarysmayuppentek.sch.id/${item.cover_buku}`} alt="Cover Buku" />
        <div>
          <img
            src={`https://api2.librarysmayuppentek.sch.id/${item.cover_buku}`}
            alt="Cover Buku"
            style={{ width: '100px', height: 'auto' }}
          />
        </div>
      ),
    },
    {
      key: 'file_ebook',
      _style: { width: '10%' },
    },
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
  const csvContent = DaftarPustaka.map((item) => Object.values(item).join(',')).join('\n')
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent)

  try {
    return (
      <>
        <CCard>
          <CCardBody>
            <div className="actionDaftarPustaka">
              <CButton color="primary" size="lg" className="btnModal" onClick={toggleModalTambah}>
                Tambah Buku
              </CButton>
              <CButton
                color="primary"
                href={csvCode}
                download="data-daftar-pustaka.csv"
                target="_blank"
                size="lg"
              >
                <CIcon icon={cilCloudDownload} size="lg" />
                {/* Download data peminjaman (.csv) */}
              </CButton>
            </div>
            <Modal isOpen={modalTambah} toggle={toggleModalTambah}>
              <ModalHeader toggle={toggleModalTambah}>Tambah Data</ModalHeader>
              <ModalBody>
                <Form innerRef={formRef} onSubmit={handleAdd}>
                  <FormGroup>
                    <Label for="kodeBuku">Kode Buku</Label>
                    <Input
                      type="text"
                      name="kodeBuku"
                      id="kodeBuku"
                      value={kodeBuku}
                      onChange={(e) => setKodeBuku(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="judul">Judul</Label>
                    <Input
                      type="text"
                      name="judul"
                      id="judul"
                      value={judul}
                      onChange={(e) => setJudul(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="penulis">Penulis</Label>
                    <Input
                      type="text"
                      name="penulis"
                      id="penulis"
                      value={penulis}
                      onChange={(e) => setPenulis(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="Kategori">Kategori</Label>
                    <Input
                      type="select"
                      name="Kategori"
                      id="Kategori"
                      value={Kategori}
                      onChange={(e) => setKategori(e.target.value)}
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="PKN">PKN</option>
                      <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                      <option value="Bahasa Inggris">Bahasa Inggris</option>
                      <option value="Sejarah">Sejarah</option>
                      <option value="Matematika">Matematika</option>
                      <option value="Penjas">Penjas</option>
                      <option value="Seni Budaya">Seni Budaya</option>
                      <option value="Agama">Agama</option>
                      <option value="TIK">TIK</option>
                      <option value="Fisika">Fisika</option>
                      <option value="Biologi">Biologi</option>
                      <option value="Kimia">Kimia</option>
                      <option value="Ekonomi">Ekonomi</option>
                      <option value="Geografi">Geografi</option>
                      <option value="Sosiologi">Sosiologi</option>
                      <option value="Lainnya">Lainnya</option>
                      {/* Tambahkan opsi tipe file lainnya sesuai kebutuhan */}
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="tahun_terbit">Tahun Terbit</Label>
                    <Input
                      type="text"
                      name="tahun_terbit"
                      id="tahun_terbit"
                      value={tahun_terbit}
                      onChange={(e) => setTahun_terbit(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="Keterangan">Tipe file</Label>
                    <Input
                      type="select"
                      name="keterangan"
                      id="keterangan"
                      value={keterangan}
                      onChange={(e) => setKeterangan(e.target.value)}
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="Buku Fisik">Buku Fisik</option>
                      <option value="Buku Digital">Buku Digital</option>
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="Jumlah">Jumlah</Label>
                    <Input
                      type="text"
                      name="jumlah"
                      id="jumlah"
                      value={jumlah}
                      onChange={(e) => setJumlah(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="cover_buku">Cover Buku</Label>
                    <Input
                      type="file"
                      name="cover_buku"
                      id="cover_buku"
                      onChange={(e) => setCover_buku(e.target.files[0])}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="file_ebook">File Buku digital</Label>
                    <Input
                      type="file"
                      name="file_ebook"
                      id="file_ebook"
                      onChange={(e) => setfile_ebook(e.target.files[0])}
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
                Form {currentBookId ? 'Edit' : 'Edit'} Data
              </ModalHeader>
              <ModalBody>
                <Form innerRef={formRef}>
                  <FormGroup>
                    <Label for="kodeBuku">Kode Buku</Label>
                    <Input
                      type="text"
                      name="kodeBuku"
                      id="kodeBuku"
                      value={kodeBuku}
                      onChange={(e) => setKodeBuku(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="judul">Judul</Label>
                    <Input
                      type="text"
                      name="judul"
                      id="judul"
                      value={judul}
                      onChange={(e) => setJudul(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="penulis">Penulis</Label>
                    <Input
                      type="text"
                      name="penulis"
                      id="penulis"
                      value={penulis}
                      onChange={(e) => setPenulis(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="Kategori">Kategori</Label>
                    <Input
                      type="select"
                      name="Kategori"
                      id="Kategori"
                      value={Kategori}
                      onChange={(e) => setKategori(e.target.value)}
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="PKN">PKN</option>
                      <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                      <option value="Bahasa Inggris">Bahasa Inggris</option>
                      <option value="Sejarah">Sejarah</option>
                      <option value="Matematika">Matematika</option>
                      <option value="Penjas">Penjas</option>
                      <option value="Seni Budaya">Seni Budaya</option>
                      <option value="Agama">Agama</option>
                      <option value="TIK">TIK</option>
                      <option value="Fisika">Fisika</option>
                      <option value="Biologi">Biologi</option>
                      <option value="Kimia">Kimia</option>
                      <option value="Ekonomi">Ekonomi</option>
                      <option value="Geografi">Geografi</option>
                      <option value="Sosiologi">Sosiologi</option>
                      <option value="Lainnya">Lainnya</option>
                      {/* Tambahkan opsi tipe file lainnya sesuai kebutuhan */}
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="tahun_terbit">Tahun Terbit</Label>
                    <Input
                      type="text"
                      name="tahun_terbit"
                      id="tahun_terbit"
                      value={tahun_terbit}
                      onChange={(e) => setTahun_terbit(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="Keterangan">Tipe file</Label>
                    <Input
                      type="select"
                      name="keterangan"
                      id="keterangan"
                      value={keterangan}
                      onChange={(e) => setKeterangan(e.target.value)}
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="Buku Fisik">Buku Fisik</option>
                      <option value="Buku Digital">Buku Digital</option>
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="Jumlah">Jumlah</Label>
                    <Input
                      type="text"
                      name="jumlah"
                      id="jumlah"
                      value={jumlah}
                      onChange={(e) => setJumlah(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="cover_buku">Cover Buku</Label>
                    <Input
                      type="file"
                      name="cover_buku"
                      id="cover_buku"
                      onChange={(e) => setCover_buku(e.target.files[0])}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      type="hidden"
                      name="cover_buku"
                      id="cover_buku"
                      onChange={(e) => setCover_buku(e.target.files[0])}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="file_ebook">File Buku digital</Label>
                    <Input
                      type="file"
                      name="file_ebook"
                      id="file_ebook"
                      onChange={(e) => setfile_ebook(e.target.files[0])}
                    />
                  </FormGroup>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  color="primary"
                  onClick={currentBookId ? () => handleUpdate(currentBookId) : handleAdd}
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
              cleaner
              footer
              clickableRows
              columns={columns}
              loading={loading}
              // columnFilter
              columnSorter
              items={DaftarPustaka}
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
                          toggleDetails(item.idBuku)
                        }}
                      >
                        {details.includes(item.idBuku) ? 'Hide' : 'Show'}
                      </CButton>
                    </td>
                  )
                },
                details: (item) => {
                  return (
                    <CCollapse visible={details.includes(item.idBuku)}>
                      <CCardBody className="p-3">
                        <h4>Buku {item.judul}</h4>
                        <p className="text-muted">Ditulis oleh {item.penulis}</p>
                        <CButton
                          size="sm"
                          color="primary"
                          onClick={() => {
                            toggleModal(item.kodeBuku)
                          }}
                        >
                          Edit
                        </CButton>
                        <CButton size="sm" color="danger" onClick={() => handleDelete(item.idBuku)}>
                          Delete
                        </CButton>
                        <Link to={`/ShowPdf/${item.idBuku}`}>
                          <CButton size="sm" color="dark">
                            Show Ebook
                          </CButton>
                        </Link>
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

export default AdminDaftarPustaka
