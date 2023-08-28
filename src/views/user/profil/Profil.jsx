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
      fetchHistory(Nama)
    }
  }, [Nama])

  const fetchData = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshTokenSiswa')

      if (!refreshToken) {
        throw new Error('Refresh token siswa not found')
      }

      const response = await axios.get(`http://localhost:3005/berhasilLogin/${refreshToken}`)

      const decoded = jwtDecode(response.data.accessToken)
      setNama(decoded.Nama)
      setSiswaId(decoded.siswaId)
      setKelas(decoded.Kelas)
      setJurusan(decoded.Jurusan)

      console.log(decoded)
    } catch (err) {
      if (err.message === 'Refresh token siswa not found') {
        navigate('/siswa/login')
      } else if (err.response && err.response.status === 401) {
        navigate('/siswa/login')
      }
      console.log(err)
    }
  }
  const fetchHistory = async (nama) => {
    try {
      console.log('Fetching history for user:', nama)
      const response = await axios.get(`http://localhost:3005/history/${nama}`)
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
    try {
      const confirmed = window.confirm('Apakah Anda yakin ingin menghapus?')
      if (confirmed) {
        await axios.delete(`http://localhost:3005/history/${idRiwayat}`)
        fetchHistory()
        window.location.reload()
        console.log(`Delete button clicked for item with ID: ${idRiwayat}`)
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
          <h2>NIS: {siswaId}</h2>
          <h2>Kelas: {Kelas}</h2>
          <h2>Jurusan: {Jurusan}</h2>
        </div>

        <div className="reading-history">
          <h2>Riwayat baca</h2>
          <Row className="mb-4 katalog">
            {RiwayatDatas.map((item) => (
              <Card className="shadow history-card" key={item.kodeBukuRiwayat}>
                <div className="dropdown-container">
                  <Card.Img variant="top" src={`http://localhost:3005/${item.coverRiwayat}`} />
                  <Card.Body>
                    <Card.Title>{item.judulRiwayat}</Card.Title>
                    <Card.Text>Tersedia: {item.tersediaRiwayat}</Card.Text>
                    <Card.Text>
                      Diakses pada: {moment(item.TanggalAkses).format('DD/MM/YYYY HH:mm')}
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
