import React, { useState, useEffect, useRef } from 'react'
import '../admin-dataAnggota/AdminDataAnggota.scss'
import './AdminDaftarPustaka.scss'

import {
  CButton,
  CCard,
  CCardBody,
  CCollapse,
  CSmartTable,
  CAlert,
  CImage,
  CBadge,
} from '@coreui/react-pro'
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
import { cilCloudDownload, cilCheckCircle } from '@coreui/icons'
import { Link } from 'react-router-dom'
import jwtDecode from 'jwt-decode'

const AdminDaftarPustaka = () => {
  const [loading, setLoading] = useState()
  const [DaftarPustaka, setDaftarPustaka] = useState([])
  const [kodeBuku, setKodeBuku] = useState('')
  const [judul, setJudul] = useState('')
  const [penulis, setPenulis] = useState('')
  const [Kategori, setKategori] = useState('')
  const [ringkasan, setRingkasan] = useState('')
  const [tahun_terbit, setTahun_terbit] = useState('')
  const [keterangan, setKeterangan] = useState('')
  const [jumlah, setJumlah] = useState('')
  const [tersedia, setTersedia] = useState('')
  const [cover_buku, setCover_buku] = useState(null)
  const [file_ebook, setfile_ebook] = useState(null)
  const [modalTambah, setModalTambah] = useState(false)
  const [modalUpdate, setModalUpdate] = useState(false)
  const [currentBookId, setCurrentBookId] = useState('')
  const [coverWarning, setCoverWarning] = useState('')
  const [fileWarning, setfileWarning] = useState('')
  const [kategoriLainnya, setKategoriLainnya] = useState('')
  const [isApproval, setIsApproval] = useState('Belum Disetujui')

  const [msg, setMsg] = useState(null)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  const formRef = useRef(null)

  useEffect(() => {
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

  useEffect(() => {
    fetchData()
    setLoading(false)
  }, [])

  const toggleModalTambah = () => {
    setKodeBuku('')
    setJudul('')
    setPenulis('')
    setKategori('')
    setRingkasan('')
    setTahun_terbit('')
    setKeterangan('')
    setJumlah('')
    setCover_buku(cover_buku || '')
    setfile_ebook(file_ebook || '')

    setModalTambah(!modalTambah)
  }

  const toggleModalUpdate = () => {
    setModalUpdate(!modalUpdate)
  }

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3005/book')
      setDaftarPustaka(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAdd = (e) => {
    e.preventDefault()
    let selectedKategori
    if (Kategori === 'Lainnya') {
      // Use kategoriLainnya as the selected Kategori
      selectedKategori = kategoriLainnya
    } else {
      // Use Kategori as is
      selectedKategori = Kategori
    }

    axios
      .get(`http://localhost:3005/check-kodeBuku/${kodeBuku}`) // Replace with your API endpoint
      .then((response) => {
        if (response.data.exists) {
          // Show a warning to the user that kodeBuku already exists
          alert('Kode Buku sudah ada, coba yang lain.')
        } else {
          // KodeBuku doesn't exist, proceed with form submission
          const formData = new FormData(formRef.current)
          formData.set('Kategori', selectedKategori)
          cover_buku?.files && formData.append('cover_buku', cover_buku.files[0])
          file_ebook?.files && formData.append('file_ebook', file_ebook.files[0])

          axios
            .post('http://localhost:3005/book', formData)
            .then((res) => {
              toggleModalTambah()
              fetchData()
              setMsg(res.data.message)
              setShowSuccessAlert(true)

              setTimeout(() => {
                setShowSuccessAlert(false)
              }, 3000)
            })
            .catch((error) => {
              console.error(error)
            })
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleDelete = async (kodeBuku) => {
    try {
      const response = await axios.delete(`http://localhost:3005/book/${kodeBuku}`)
      setMsg(response.data.message)
      setShowSuccessAlert(true)

      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const handleJumlahChange = (e) => {
    const newJumlah = e.target.value !== '' ? parseInt(e.target.value) : ''
    const oldJumlah = jumlah
    const jumlahDiff = newJumlah - oldJumlah

    if (!isNaN(jumlahDiff)) {
      setTersedia(parseInt(tersedia) + jumlahDiff)
    }

    console.log('New Jumlah:' + newJumlah)
    console.log('Jumlah Diff:' + jumlahDiff)

    setJumlah(newJumlah)
  }

  const handleUpdate = async () => {
    const formData = new FormData(formRef.current)

    // cover_buku?.files && formData.append('cover_buku', cover_buku.files[0])
    // file_ebook?.files && formData.append('cover_buku', file_ebook.files[0])
    if (cover_buku?.files && file_ebook?.files) {
      formData.append('cover_buku', cover_buku.files[0])
      formData.append('file_ebook', file_ebook.files[0])
    } else if (file_ebook?.files) {
      formData.append('file_ebook', file_ebook.files[0])
    } else if (cover_buku?.files) {
      formData.append('cover_buku', cover_buku.files[0])
    }

    console.log('after', formData)
    try {
      const response = await axios.put(
        `http://localhost:3005/book/${currentBookId.kodeBuku}`,
        formData,
      )

      setDaftarPustaka((prevData) => {
        return prevData.map((item) => {
          if (item.kodeBuku === currentBookId) {
            return {
              ...item,
              kodeBuku: kodeBuku || item.kodeBuku,
              judul: judul || item.judul,
              penulis: penulis || item.penulis,
              Kategori: Kategori || item.Kategori,
              ringkasan: ringkasan || item.ringkasan,
              tahun_terbit: tahun_terbit || item.tahun_terbit,
              keterangan: keterangan || item.keterangan,
              jumlah: jumlah || item.jumlah,
              tersedia: tersedia || item.tersedia,
              cover_buku: cover_buku?.files[0]?.name || item.cover_buku,
              file_ebook: file_ebook?.files[0]?.name || item.file_ebook,
            }
          }
          console.log(currentBookId.kodeBuku)
          console.log(tersedia)
          return item
        })
      })

      toggleModalUpdate()
      fetchData()
      setMsg(response.data.message)
      setShowSuccessAlert(true)

      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)

      // Setel ulang nilai input menjadi kosong atau nilai default
      setKodeBuku('')
      setJudul('')
      setPenulis('')
      setKategori('')
      setRingkasan('')
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
    setRingkasan(book.ringkasan)
    setTahun_terbit(book.tahun_terbit)
    setKeterangan(book.keterangan)
    setJumlah(book.jumlah)
    setTersedia(book.tersedia)
    setCover_buku(book.cover_buku)
    setfile_ebook(book.file_ebook)
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
    { key: 'kategori', _style: { width: '10%' } },
    { key: 'keterangan', _style: { width: '10%' } },
    { key: 'jumlah', _style: { width: '5%' } },
    { key: 'tersedia', _style: { width: '5%' } },
    {
      key: 'isApproval',
      _style: { width: '10%' },
    },
    {
      key: 'berkasBuku',
      _style: { width: '10%' },
    },
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      filter: false,
      sorter: false,
    },
  ]
  const getBadge = (isApproval) => {
    switch (isApproval) {
      case 'Disetujui':
        return 'primary'
      case 'Belum Disetujui':
        return 'warning'
      case 'Ditolak':
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
  const csvContent = DaftarPustaka.map(getCsvRow).join('\n')
  const csvCode =
    'data:text/csv;charset=utf-8,' + encodeURIComponent(getCsvHeader() + '\n' + csvContent)

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
                isApproval: (item) => (
                  <td>
                    <CBadge color={getBadge(item.isApproval)}>{item.isApproval}</CBadge>
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
                          toggleDetails(item.kodeBuku)
                        }}
                      >
                        {details.includes(item.kodeBuku) ? 'Hide' : 'Aksi'}
                      </CButton>
                    </td>
                  )
                },
                details: (item) => {
                  return (
                    <CCollapse visible={details.includes(item.kodeBuku)}>
                      <CCardBody className="p-3">
                        <h4>Buku {item.judul}</h4>
                        <p className="text-muted">Ditulis oleh {item.penulis}</p>
                        <p className="text-muted">Tahun terbit {item.tahun_terbit}</p>
                        <CButton
                          size="sm"
                          color="primary"
                          onClick={() => {
                            toggleModal(item.kodeBuku)
                          }}
                        >
                          Edit
                        </CButton>
                        <CButton
                          size="sm"
                          color="danger"
                          onClick={() => {
                            const shouldDelete = window.confirm(
                              'Apakah Anda yakin ingin menghapus item ini?',
                            )
                            if (shouldDelete) {
                              handleDelete(item.kodeBuku)
                            }
                          }}
                        >
                          Delete
                        </CButton>

                        <Link to={`/ShowPdf/${item.kodeBuku}`}>
                          <CButton size="sm" color="dark">
                            Show Ebook
                          </CButton>
                        </Link>

                        {/* <CImage fluid src="/images/react.jpg" /> */}
                        <CImage
                          src={`http://localhost:3005/${item.cover_buku}`}
                          width={100}
                          height={100}
                        />
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

        <Modal isOpen={modalTambah} toggle={toggleModalTambah}>
          <ModalHeader toggle={toggleModalTambah}>Tambah Data</ModalHeader>
          <ModalBody>
            <Form innerRef={formRef} onSubmit={handleAdd}>
              <div className="grid-form">
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
                  {Kategori === 'Lainnya' && (
                    <Input
                      type="text"
                      placeholder="Masukkan kategori lainnya"
                      value={kategoriLainnya}
                      onChange={(e) => setKategoriLainnya(e.target.value)}
                    />
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="ringkasan">Ringkasan</Label>
                  <Input
                    type="textarea"
                    name="ringkasan"
                    id="ringkasan"
                    value={ringkasan}
                    onChange={(e) => setRingkasan(e.target.value)}
                  />
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
                    onChange={(e) => {
                      const selectedFile = e.target.files[0]

                      // Check if the selected file is not null
                      if (
                        selectedFile &&
                        !['image/png', 'image/jpeg', 'image/jpg'].includes(selectedFile.type)
                      ) {
                        setCoverWarning(
                          'Format file tidak sesuai. Hanya file PNG, JPG, dan JPEG yang diperbolehkan.',
                        )
                      } else {
                        setCoverWarning('') // Reset the warning message when a valid file is selected
                        setCover_buku(selectedFile) // Set the selected file to the state
                      }
                    }}
                  />
                  {coverWarning && <span className="text-danger">{coverWarning}</span>}
                </FormGroup>
                <FormGroup>
                  <Label for="file_ebook">File Buku digital</Label>
                  <Input
                    type="file"
                    name="file_ebook"
                    id="file_ebook"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0]

                      // Check if the selected file is not null
                      if (selectedFile && !['application/pdf'].includes(selectedFile.type)) {
                        setfileWarning(
                          'Format file tidak sesuai. Hanya file PNG, JPG, dan JPEG yang diperbolehkan.',
                        )
                      } else {
                        setfileWarning('') // Reset the warning message when a valid file is selected
                        setfile_ebook(selectedFile) // Set the selected file to the state
                      }
                    }}
                  />
                  {fileWarning && <span className="text-danger">{fileWarning}</span>}
                </FormGroup>
                <FormGroup>
                  {/* Hidden input field for isApproval */}
                  <Input type="hidden" name="isApproval" id="isApproval" value={isApproval} />
                </FormGroup>
              </div>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              color="primary"
              onClick={handleAdd}
              disabled={coverWarning || fileWarning}
            >
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
              <div className="grid-form">
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
                  {Kategori === 'Lainnya' && (
                    <Input
                      type="text"
                      placeholder="Masukkan kategori lainnya"
                      value={kategoriLainnya}
                      onChange={(e) => setKategoriLainnya(e.target.value)}
                    />
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="ringkasan">Ringkasan</Label>
                  <Input
                    type="textarea"
                    name="ringkasan"
                    id="ringkasan"
                    value={ringkasan}
                    onChange={(e) => setRingkasan(e.target.value)}
                  />
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
                    onChange={handleJumlahChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="Tersedia">Tersedia</Label>
                  <Input
                    type="text"
                    name="tersedia"
                    id="tersedia"
                    value={tersedia}
                    onChange={(e) => setTersedia(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="cover_buku">Cover Buku</Label>
                  <Input
                    type="file"
                    name="cover_buku"
                    id="cover_buku"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0]

                      // Check if the selected file is not null
                      if (
                        selectedFile &&
                        !['image/png', 'image/jpeg', 'image/jpg'].includes(selectedFile.type)
                      ) {
                        setCoverWarning(
                          'Format file tidak sesuai. Hanya file PNG, JPG, dan JPEG yang diperbolehkan.',
                        )
                      } else {
                        setCoverWarning('') // Reset the warning message when a valid file is selected
                        setCover_buku(selectedFile) // Set the selected file to the state
                      }
                    }}
                  />
                  {coverWarning && <span className="text-danger">{coverWarning}</span>}
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
                    onChange={(e) => {
                      const selectedFile = e.target.files[0]

                      // Check if the selected file is not null
                      if (selectedFile && !['application/pdf'].includes(selectedFile.type)) {
                        setfileWarning('Format file tidak sesuai. Hanya file PDF')
                      } else {
                        setfileWarning('') // Reset the warning message when a valid file is selected
                        setfile_ebook(selectedFile) // Set the selected file to the state
                      }
                    }}
                  />
                  {fileWarning && <span className="text-danger">{fileWarning}</span>}
                </FormGroup>
              </div>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              color="primary"
              onClick={currentBookId ? () => handleUpdate(currentBookId) : handleAdd}
              disabled={coverWarning || fileWarning} // Disable the button if there is a warning
            >
              Simpan
            </Button>
            <Button color="secondary" onClick={toggleModalUpdate}>
              Batal
            </Button>
          </ModalFooter>
        </Modal>
      </>
    )
  } catch (e) {
    alert(e.message)
  }
}

export default AdminDaftarPustaka
