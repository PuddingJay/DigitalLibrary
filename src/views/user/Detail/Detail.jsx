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
} from '@coreui/react-pro'
import './Detail.scss'
import jwtDecode from 'jwt-decode'


// import { Link, useHistory } from "react-router-dom";
import { CButton, CCard, CCardBody } from '@coreui/react-pro'

const DetailBuku = () => {
  const [catalogItem, setCatalogItem] = useState(null)
  const linkUper = 'https://universitaspertamina.ac.id/'
  const params = useParams()
  const [nama, setNama] = useState('')
  const [NIS, setNIS] = useState('')
  const [kodeBuku, setKodeBuku] = useState('')
  const [judulBuku, setJudulBuku] = useState('')

  const formatDate = (dateString) => {
    if (!dateString) return ''

    const dateObj = new Date(dateString)
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const today = formatDate(new Date());
  useEffect(() => {
    fetchSiswa()
  }, [])

  const fetchSiswa = async () => {
    const refreshToken = localStorage.getItem('refreshTokenSiswa')
    const response = await axios.get(`http://localhost:3005/berhasilLogin/${refreshToken}`)

    const decoded = jwtDecode(response.data.accessToken)
    setNama(decoded.Nama)
    setNIS(decoded.siswaId)
  }


  const formOnChangeTglPinjam = (value) => {
    value !== null
      ? setAddFormData({
        ...addFormData,
        waktuBooking: formatDate(value),
      })
      : setAddFormData({
        ...addFormData,
        waktuBooking: null,
      })

    console.log(addFormData);
  }

  const [addFormData, setAddFormData] = useState({
    NIS: NIS,
    nama: nama,
    judulBuku: judulBuku,
    waktuBooking: today,
  })

  const handleBatal = () => {
    setAddFormData({
      ...addFormData,
      waktuBooking: today
    })
  }

  const [visible, setVisible] = useState(false)
  const toggleModal = () => {
    setVisible(!visible)
    handleBatal()
  }

  useEffect(() => {
    const fetchCatalogItem = async () => {
      try {
        const url = `http://localhost:3005/book/${params.id}`
        const response = await axios.get(url)
        setCatalogItem(response.data.data[0])
        setJudulBuku(response.data.data[0].judul)
        setKodeBuku(response.data.data[0].kodeBuku)
        // console.log(response.data.data[0])
      } catch (error) {
        console.error(error)
      }
    }
    fetchCatalogItem()
  }, [params.id])

  if (!catalogItem) {
    return <CSpinner />
  }

  const handleTambahBooking = async () => {
    try {
      const dataBooking = {
        NIS: NIS,
        nama: nama,
        kodeBuku: kodeBuku,
        judulBuku: judulBuku,
        waktuBooking: addFormData.waktuBooking
      }
      const response = await axios.post('http://localhost:3005/booking-pinjam', dataBooking)
      // console.log(response)
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
            src={`http://localhost:3005/${catalogItem.cover_buku}`}
            alt={catalogItem.judul}
            className="bookPoster"
          />
          {catalogItem.keterangan === 'Buku Fisik' ? (
            <CButton colors="primary" disabled className="disabledButton">
              Baca
            </CButton>
          ) : (
            <Link to={`/PdfRead/${catalogItem.idBuku}`}>
              <CButton colors="primary">Baca</CButton>
            </Link>
          )}
        </div>
        <div className="bookInfo">
          <h2 className="bookTitle">{catalogItem.judul}</h2>
          <div className="bookLabel">
            <CCard>
              <CCardBody> {catalogItem.Kategori}</CCardBody>
            </CCard>
            <CCard>
              <CCardBody> {catalogItem.keterangan}</CCardBody>
            </CCard>
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
      <CFooter>
        <CImage href={linkUper} className="logo" rounded src="/images/logouper.png" />
        <div style={{ fontFamily: 'Poppins' }}>
          <span className="ms-1"> Copyright &copy; 2023 Pengabdian Kepada Masyarakat</span>
          <CLink href={linkUper} target="_blank" rel="noreferrer">
            Universitas Pertamina
          </CLink>
        </div>
      </CFooter>

      <CModal alignment="center" scrollable visible={visible}>
        <CModalHeader>
          <CModalTitle>Form ingin meminjam buku</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CDatePicker
              name="waktuBooking"
              footer
              locale="id-ID"
              id="waktuBooking"
              label="Waktu Booking"
              value={addFormData.waktuBooking}
              date={today}
              onDateChange={formOnChangeTglPinjam}
              className="mb-3"
            />
            <CFormInput type="text" label="NIS" id="inputNIS" name="NIS" className="mb-3" value={NIS} readOnly />
            <CFormInput type="text" label="Nama" id="inputNama" name="nama" className="mb-3" value={nama} readOnly />
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
          <CButton type="submit" onClick={handleTambahBooking}> Tambah </CButton>
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
