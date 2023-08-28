/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
// import logo from '../../assets/logoSMA.png'

import jwtDecode from 'jwt-decode'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const FeedbackForm = () => {
  const [Nama, setNama] = useState('')
  const [Kelas, setKelas] = useState('')
  const [siswaId, setSiswaId] = useState('')
  const [SaranDatas, setSaranDatas] = useState([])
  const [Jurusan, setJurusan] = useState('')
  //   const [saran, setSaran] = useState([])
  const [siswas, setSiswas] = useState([])
  const navigate = useNavigate()

  const [addFormData, setAddFormData] = useState({
    NIS: null,
    pemberiSaran: null,
    saranJudulBuku: null,
    saranPengarangBuku: null,
  })

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        // window.location.href = '/siswa/login'
      } else if (err.response && err.response.status === 401) {
        navigate('/siswa/login')
        // window.location.href = '/siswa/login'
      }
      console.log(err)
    }
  }

  const formOnSubmitHandler = (event) => {
    event.preventDefault()

    // Pastikan siswaId dan nama sudah terisi dari hasil fetchData
    if (!siswaId || !Nama) {
      console.log('Data NIS dan pemberiSaran belum terisi.')
      return
    }

    const newDataSaran = {
      NIS: siswaId, // Menggunakan siswaId yang sudah didapatkan dari fetchData
      pemberiSaran: Nama, // Menggunakan nama yang sudah didapatkan dari fetchData
      saranJudulBuku: addFormData.saranJudulBuku, // Pastikan properti ini sudah sesuai dengan yang diinginkan
      saranPengarangBuku: addFormData.saranPengarangBuku, // Pastikan properti ini sudah sesuai dengan yang diinginkan
    }

    console.log(newDataSaran)
    const newDataSarans = [...SaranDatas, newDataSaran]
    setSaranDatas(newDataSarans)

    axios
      .post('http://localhost:3005/kotaksaran', newDataSaran)
      .then((res) => {
        console.log(res)
        fetchData() // Ambil data terbaru setelah pengiriman sukses
        setAddFormData({})
        window.location.reload()
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          alert('error')
        }
        console.log(err)
      })
  }

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <h2>Kotak Saran</h2>
      </div>
      <br />
      <form onSubmit={formOnSubmitHandler} style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ flex: '1', maxWidth: '400px', marginRight: '10px' }}>
            <h4>Judul Buku</h4>
            <input
              value={addFormData.saranJudulBuku}
              onChange={(e) => setAddFormData({ ...addFormData, saranJudulBuku: e.target.value })}
              required
            />
          </div>
          <div style={{ flex: '1', maxWidth: '400px', marginLeft: '10px' }}>
            <h4>Penulis Buku</h4>
            <input
              value={addFormData.saranPengarangBuku}
              onChange={(e) =>
                setAddFormData({ ...addFormData, saranPengarangBuku: e.target.value })
              }
              required
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            alignSelf: 'center',
            marginTop: '20px',
            backgroundColor: 'blue', // Ubah warna tombol menjadi biru di sini
            color: 'white', // Tambahkan warna teks menjadi putih agar terlihat jelas pada latar biru
            padding: '10px 20px', // Tambahkan padding agar tombol terlihat lebih besar
            borderRadius: '5px', // Tambahkan borderRadius agar tombol terlihat lebih bulat
            border: 'none', // Hilangkan border agar tombol terlihat lebih bersih
            cursor: 'pointer', // Tambahkan cursor pointer agar tampilan tombol berubah saat dihover
          }}
        >
          Kirim
        </button>
      </form>
    </div>
  )
}

export default FeedbackForm
