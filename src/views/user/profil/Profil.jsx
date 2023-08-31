/* eslint-disable prettier/prettier */
// import React from 'react'
import React, { useEffect, useState } from 'react'
// import logo from '../../assets/logoSMA.png'
import Card from 'react-bootstrap/Card'
import { Row } from 'react-bootstrap'
import NavbarComponent from '../../../component/navbar/NavbarComponent'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../../../component/user-book/books.scss'
import './profil.scss'
import moment from 'moment'

const Profil = () => {
  const [Nama, setNama] = useState('')
  const [Kelas, setKelas] = useState('')
  const [NIS, setNIS] = useState('')
  const [siswaId, setSiswaId] = useState('')
  const [Jurusan, setJurusan] = useState('')
  const navigate = useNavigate()
  const [RiwayatDatas, setRiwayatDatas] = useState([])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (Nama) {
      fetchHistory(NIS) // Menggunakan NIS, bukan Nama
    }
  }, [Nama, NIS])

  const fetchData = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshTokenSiswa')

      if (!refreshToken) {
        throw new Error('Refresh token siswa not found')
      }

      const response = await axios.get(`http://localhost:3005/berhasilLogin/${refreshToken}`)

      const decoded = jwtDecode(response.data.accessToken)

      setNama(decoded.nama)
      setSiswaId(decoded.siswaId)
      setKelas(decoded.Kelas)
      setJurusan(decoded.Jurusan)
      setNIS(decoded.siswaId)
      console.log(NIS)
    } catch (err) {
      if (err.message === 'Refresh token siswa not found') {
        navigate('/siswa/login')
        // window.location.href = '/siswa/login'
      } else if (err.response && err.response.status === 401) {
        navigate('/siswa/login')
        // window.location.href = '/siswa/login'
      }
      console.log(err)
    }
  }
  const fetchHistory = async (siswa_NIS) => {
    try {
      console.log('Fetching history for user:', NIS)
      const response = await axios.get(`http://localhost:3005/history/${NIS}`)
      if (response.data.data.length > 0) {
        setRiwayatDatas(response.data.data)
      } else {
        setRiwayatDatas([])
      }
    } catch (err) {
      console.error(err)
    }
  }
  const handleDeleteClick = async (idRiwayat) => {
    console.log(idRiwayat)
    try {
      const confirmed = window.confirm('Apakah Anda yakin ingin menghapus?')
      if (confirmed) {
        const response = await axios.delete(`http://localhost:3005/history/${idRiwayat}`)
        console.log(response.data) // Print response from server
        fetchHistory(NIS) // Menggunakan nilai NIS
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="App">
      <NavbarComponent />
      <div className="profile-container">
        <div className="profile-header">
          <h2>Nama Pengguna: {Nama}</h2>
          <h2>NIS: {NIS}</h2>
          <h2>Kelas: {Kelas}</h2>
          <h2>Jurusan: {Jurusan}</h2>
        </div>

        <div className="reading-history">
          <h2>Riwayat baca</h2>
          <Row className="mb-4 katalog">
            {RiwayatDatas.map((item) => (
              <Card className="shadow history-card" key={item.buku_kodeBuku}>
                <div className="dropdown-container">
                  <Card.Img variant="top" src={`http://localhost:3005/${item.cover}`} />
                  <Card.Body>
                    <Card.Title>{item.judul}</Card.Title>
                    <Card.Text>Tersedia: {item.tersedia}</Card.Text>
                    <Card.Text>
                      Diakses pada: {moment(item.createdAt).format('DD/MM/YYYY HH:mm')}
                      id Riwayat : {item.idRiwayat}
                    </Card.Text>
                  </Card.Body>

                  <div className="delete-button-container">
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(item.idRiwayat)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </Row>
        </div>
      </div>
    </div>
  )
}

export default Profil
