/* eslint-disable prettier/prettier */
import NavbarComponent from '../../../component/navbar/NavbarComponent'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Link } from 'react-router-dom'
import {
  CFooter,
  CLink,
  CImage,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CFormInput,
  CForm,
  CSpinner,
  CDatePicker,
  CButton,
} from '@coreui/react-pro'
import './Detail.scss'
import CIcon from '@coreui/icons-react'
import { cilThumbUp } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import moment from 'moment'

const DetailBuku = () => {
  const [catalogItem, setCatalogItem] = useState(null)
  const params = useParams()
  const [likeCount, setLikeCount] = useState(catalogItem?.likes)
  // const [, setDislikeCount] = useState(catalogItem?.dislike)
  const [Nama, setNama] = useState('')
  const [NIS, setNIS] = useState('')
  const [, setKelas] = useState('')
  const [siswaId, setSiswaId] = useState('')
  const [KomentarDatas, setKomentarDatas] = useState([])
  const [, setJurusan] = useState('')
  const navigate = useNavigate()
  const [RiwayatDatas, setRiwayatDatas] = useState([])
  const [kodeBuku, setKodeBuku] = useState(null)
  const [judulBuku, setJudulBuku] = useState('')
  const [addFormData, setAddFormData] = useState({
    siswa_NIS: null, // Menggunakan siswaId yang sudah didapatkan dari fetchData

    buku_kodeBuku: null,

    teksKomentar: '',
  })
  const formatDate = (dateString) => {
    if (!dateString) return ''

    const dateObj = new Date(dateString)
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }
  const today = formatDate(new Date())

  const [editFormData, setEditFormData] = useState({
    idKomentar: null,
    teksKomentar: '',
  })

  const handleEdit = (idKomentar, teksKomentar) => {
    setEditFormData({
      idKomentar,
      teksKomentar,
    })
  }
  const handleUpdate = async (idKomentar) => {
    const updatedData = {
      teksKomentar: editFormData.teksKomentar,
      waktuKomentar: moment(), // Update waktuKomentar ke waktu saat ini
    }

    try {
      await axios.put(`https://api2.librarysmayuppentek.sch.id/komentar/${idKomentar}`, updatedData)
      // Refresh daftar komentar setelah berhasil mengedit
      fetchKomentar()
      // Kembali ke tampilan biasa
      setEditFormData({
        idKomentar: null,
        teksKomentar: '',
      })
    } catch (error) {
      console.error(error)
      if (error.response && error.response.status === 404) {
        alert('error')
      }
    }
  }

  const fetchData = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshTokenSiswa')

      if (!refreshToken) {
        throw new Error('Refresh token siswa not found')
      }

      const response = await axios.get(`https://api2.librarysmayuppentek.sch.id/berhasilLogin/${refreshToken}`)

      const decoded = jwtDecode(response.data.accessToken)
      setNama(decoded.nama)
      console.log(decoded.nama)
      setSiswaId(decoded.siswaId)
      setKelas(decoded.Kelas)
      setJurusan(decoded.Jurusan)
      setNIS(decoded.siswaId)
      // console.log(NIS)
    } catch (err) {
      if (err.message === 'Refresh token siswa not found') {
        // navigate('/siswa/login')
        window.location.href = '/siswa/login'
      } else if (err.response && err.response.status === 401) {
        // navigate('/siswa/login')
        window.location.href = '/siswa/login'
      }
      console.log(err)
    }
  }

  const formOnChangeTglPinjam = (value) => {
    if (value == null) {
      setAddFormDataMemesan((prevData) => ({
        ...prevData,
        tglPemesanan: null,
      }))
    } else {
      setAddFormDataMemesan((prevData) => ({
        ...prevData,
        tglPemesanan: formatDate(value),
      }))
    }
    console.log(addFormDataMemesan)
  }

  const [addFormDataMemesan, setAddFormDataMemesan] = useState({
    Siswa_NIS: NIS,
    // nama: Nama,
    Buku_kodeBuku: kodeBuku,
    tglPemesanan: today,
  })

  const handleBatal = () => {
    setAddFormData({
      ...addFormDataMemesan,
      tglPemesanan: today,
    })
  }

  const [visible, setVisible] = useState(false)
  const toggleModal = () => {
    setVisible(!visible)
    handleBatal()
  }

  useEffect(() => {
    if (catalogItem) {
      setKodeBuku(catalogItem.kodeBuku)
    }
  }, [catalogItem])

  useEffect(() => {
    const fetchCatalogItem = async () => {
      // console.log(params.id)
      try {
        const url = `https://api2.librarysmayuppentek.sch.id/book/${params.id}`
        const response = await axios.get(url)
        // console.log(response)
        setCatalogItem(response.data.data[0])
        setLikeCount(response.data.data[0]?.likes)
        // setDislikeCount(response.data.data[0]?.dislike)
        setJudulBuku(response.data.data[0].judul)
        setKodeBuku(response.data.data[0].kodeBuku)
      } catch (error) {
        console.error(error)
      }
    }
    fetchCatalogItem()

    fetchData()
  }, [params.id])

  useEffect(() => {
    if (kodeBuku) {
      fetchKomentar()
    }
  }, [kodeBuku])

  // console.log(catalogItem)
  if (!catalogItem) {
    return <div>Loading...</div>
  }

  const handleLikeClick = async () => {
    try {
      // Send a request to update the likes count in the database
      const url = `https://api2.librarysmayuppentek.sch.id/updateTop/${params.id}`
      console.log(params.id)
      const response = await axios.put(url, {
        kodeBuku: params.id, // Assuming 'params.id' contains the book's kodeBuku
        likes: likeCount + 1,
      })
      // Update the local like count state with the updated value from the server
      setLikeCount(response.data.data.likes)
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }
  const fetchKomentar = async () => {
    try {
      const response = await axios.get(`https://api2.librarysmayuppentek.sch.id/komentar/${catalogItem.kodeBuku}`)
      if (response.data.data.length > 0) {
        setKomentarDatas(response.data.data)
      } else {
        setKomentarDatas([])
      }
    } catch (err) {
      console.error(err)
    }
  }

  const formOnSubmitHandler = async (event) => {
    event.preventDefault()

    // Pastikan siswaId dan nama sudah terisi

    const newDataKomentar = {
      siswa_NIS: NIS,
      buku_kodeBuku: kodeBuku,
      teksKomentar: addFormData.teksKomentar,
      waktuKomentar: moment(),
    }
    console.log(newDataKomentar)
    try {
      const response = await axios.post('https://api2.librarysmayuppentek.sch.id/komentar', newDataKomentar)
      console.log('response', response.data)

      // Jika komentar berhasil dikirim, tambahkan komentar baru ke state KomentarDatas
      setKomentarDatas([...KomentarDatas, response.data.data])
      setAddFormData({ teksKomentar: '' })
      fetchKomentar()
    } catch (error) {
      console.error(error)
      if (error.response && error.response.status === 404) {
        alert('error')
      }
    }
  }

  const handleDelete = async (idKomentar) => {
    try {
      await axios.delete(`https://api2.librarysmayuppentek.sch.id/komentar/${idKomentar}`)
      fetchData()
    } catch (err) {
      console.log(err)
    }
  }

  const formOnSubmitRiwayat = async (event) => {
    event.preventDefault()

    // Pastikan siswaId dan nama sudah terisi dari hasil fetchData
    if (!siswaId || !Nama) {
      console.log('Data NIS dan namaKomentator belum terisi.')
      return
    }

    const newDataRiwayat = {
      siswa_NIS: NIS,
      // nama: Nama,
      buku_kodeBuku: kodeBuku,

      tersediaRiwayat: catalogItem.tersedia,
      createdAt: moment(),
    }

    try {
      const response = await axios.post('https://api2.librarysmayuppentek.sch.id/history', newDataRiwayat)
      console.log(response.data)

      setRiwayatDatas([...RiwayatDatas, response.data.data])
      setAddFormData({})
      navigate(`/PdfRead/${catalogItem.kodeBuku}`)
    } catch (error) {
      console.error(error)
      if (error.response && error.response.status === 404) {
        alert('error')
      }

      if (!catalogItem) {
        return <CSpinner />
      }
    }
  }

  const handleTambahBooking = async () => {
    try {
      const dataBooking = {
        Siswa_NIS: NIS,
        Buku_kodeBuku: kodeBuku,
        tglPemesanan: addFormDataMemesan.tglPemesanan,
      }
      const response = await axios.post('https://api2.librarysmayuppentek.sch.id/booking-pinjam', dataBooking)
      // console.log(response)
      setAddFormDataMemesan((prevData) => ({
        ...prevData,
        tglPemesanan: today,
      }))

      alert(response.data.message)
      toggleModal()
    } catch (err) {
      alert(err.response.data.message)
    }
  }

  return (
    <div className="App">
      <NavbarComponent />
      <div className="bookDetailContainer">
        <div className="bookPosterAction">
          <img
            src={`https://api2.librarysmayuppentek.sch.id/${catalogItem.cover}`}
            alt={catalogItem.judul}
            className="bookPoster"
          />
          {catalogItem.keterangan === 'Buku Fisik' ? (
            <CButton
              colors="primary"
              style={{ display: 'none' }}
              disabled
              className="disabledButton"
            >
              Baca
            </CButton>
          ) : (
            <Link to={`/PdfRead/${catalogItem.kodeBuku}`}>
              <CButton type="submit" className="btnBaca" onClick={formOnSubmitRiwayat}>
                Baca
              </CButton>
            </Link>
          )}
          <div className="likesContainerWrapper">
            <div className="likesContainer">
              <div className="likeButton">
                <CIcon icon={cilThumbUp} onClick={handleLikeClick} />
                <Link to={`/Detail/${catalogItem.kodeBuku}`}></Link>
              </div>
              <div className="likeCount">{likeCount}</div>
            </div>
          </div>
          <ul>
            {KomentarDatas.map((komentar, index) => (
              <li key={index}>
                {komentar && !komentar.deleted && (
                  <div className="comment-container">
                    {editFormData.idKomentar === komentar.idKomentar ? (
                      // Mode Edit
                      <div>
                        <input
                          type="text"
                          value={editFormData.teksKomentar}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              teksKomentar: e.target.value,
                            })
                          }
                        />
                        <button onClick={() => handleUpdate(editFormData.idKomentar)}>
                          Update
                        </button>
                      </div>
                    ) : (
                      // Tampilan Biasa
                      <div className="comment-text-container">
                        <div className="comment-header">
                          <p className="comment-text">
                            {/* {komentar.nama} : {komentar.teksKomentar} */}
                            {komentar?.nama} : {komentar?.teksKomentar}
                          </p>
                          {komentar.nama === Nama && (
                            <>
                              <div className="edit-delete-container">
                                <p
                                  onClick={() => {
                                    const confirmation = window.confirm(
                                      'Are you sure you want to delete this comment?',
                                    )
                                    if (confirmation) {
                                      handleDelete(komentar.idKomentar)
                                    }
                                  }}
                                  className="delete-button"
                                >
                                  Delete
                                </p>
                                <p
                                  onClick={() =>
                                    handleEdit(komentar.idKomentar, komentar.teksKomentar)
                                  }
                                  className="edit-button"
                                >
                                  Edit
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                        <p className="comment-time">
                          {moment(komentar.waktuKomentar).format('DD/MM/YYYY HH:mm')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <form
            onSubmit={formOnSubmitHandler}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <input
              value={addFormData.teksKomentar || ''}
              placeholder="Tulis Komentar"
              onChange={(e) => setAddFormData({ ...addFormData, teksKomentar: e.target.value })}
              required
              style={{
                width: '75%', // Lebar form input diatur menjadi lebih panjang
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                marginRight: '10px',
                outline: 'none',
                fontSize: '14px',
              }}
            />
            <button
              type="submit"
              style={{
                width: '20%', // Lebar tombol kirim diatur menjadi lebih pendek
                backgroundColor: '#29266a',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Kirim
            </button>
          </form>
        </div>

        <div className="bookInfo">
          <h2 className="bookTitle">{catalogItem.judul}</h2>
          <div className="bookLabel">
            {/* <CCard> */}
            <CButton disabled variant="outline">
              {' '}
              {catalogItem.kategori}
            </CButton>
            {/* </CCard> */}
            {/* <CCard> */}
            <CButton disabled variant="outline">
              {' '}
              {catalogItem.keterangan}
            </CButton>
            {/* </CCard> */}
            <CButton onClick={toggleModal}> Booking Pinjam </CButton>
          </div>
          <div className="bookCreated">
            <h3>Information</h3>
            <p>{catalogItem.ringkasan}</p>
            <h4>Pengarang</h4>
            <p>Penulis : {catalogItem.penulis}</p>
            <h4>Tahun Terbit</h4>
            <p>Tahun Terbit : {catalogItem.tahun_terbit}</p>
            <h4>Tersedia</h4>
            <p>Tersedia : {catalogItem.tersedia}</p>
          </div>
        </div>
      </div>
      {/* <CFooter>
        <CImage href={linkUper} className="logo" rounded src="/images/logouper.png" />
        <div style={{ fontFamily: 'Poppins' }}>
          <span className="ms-1"> Copyright &copy; 2023 Pengabdian Kepada Masyarakat</span>
          <CLink href={linkUper} target="_blank" rel="noreferrer">
            Universitas Pertamina
          </CLink>
        </div>
      </CFooter> */}

      <CModal alignment="center" scrollable visible={visible}>
        <CModalHeader>
          <CModalTitle>Form ingin meminjam buku</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CDatePicker
              name="tglPemesanan"
              footer
              locale="id-ID"
              id="waktuBooking"
              label="Waktu Booking"
              value={addFormDataMemesan.tglPemesanan}
              date={today}
              minDate={today}
              onDateChange={formOnChangeTglPinjam}
              className="mb-3"
            />
            <CFormInput
              type="text"
              label="NIS"
              id="inputNIS"
              name="NIS"
              className="mb-3"
              value={NIS}
              readOnly
            />
            <CFormInput
              type="text"
              label="Nama"
              id="inputNama"
              name="nama"
              className="mb-3"
              value={Nama}
              readOnly
            />
            <CFormInput
              type="text"
              label="Kode Buku"
              id="inputKodeBuku"
              name="kodeBuku"
              className="mb-3"
              value={kodeBuku}
              readOnly
            />
            <CFormInput
              type="text"
              label="Judul Buku"
              id="inputJudulBuku"
              name="judulBuku"
              className="mb-3"
              value={judulBuku}
              readOnly
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton type="submit" onClick={handleTambahBooking}>
            {' '}
            Tambah{' '}
          </CButton>
          <CButton color="light" onClick={toggleModal}>
            {' '}
            Kembali{' '}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default DetailBuku
