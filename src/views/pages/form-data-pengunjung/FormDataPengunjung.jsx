import React, { useState /*useEffect*/ } from 'react'
import './formDataPengunjung.scss'
import { CAlert, CForm, CFormInput, CButton, CFormSelect } from '@coreui/react-pro'
import { CCard, CCardBody, CCardHeader } from '@coreui/react-pro'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle } from '@coreui/icons'

const DataPengunjung = () => {
  const [inputValues, setInputValues] = useState({
    nama: '',
    tipePengunjung: '',
    asal: '',
  })
  // const [siswas, setSiswas] = useState([])
  const options = ['Open this select menu', 'Siswa', 'Guru', 'Tamu']
  const [msg, setMsg] = useState('')
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)

  // useEffect(() => {
  //   fetchSisws()
  // }, [])

  // const fetchSisws = async () => {
  //   try {
  //     const responseSiswa = await axios.get('http://localhost:3005/siswa')
  //     setSiswas(responseSiswa.data?.data ?? [])
  //     // console.log(responseSiswa.data.data)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }))
    // if (name === 'NIS') {
    //   const nisValue = parseInt(value)
    //   const sisw = siswas.find((item) => item.NIS === nisValue)
    //   const namaSiswa = sisw ? sisw.Nama : ''
    //   const kelasSiswa = sisw ? sisw.Kelas : ''

    //   setInputValues({
    //     NIS: value,
    //     nama: namaSiswa,
    //     kelas: kelasSiswa,
    //   })
    // }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    const { nama, tipePengunjung, asal } = inputValues
    if (!tipePengunjung || !nama || !asal) {
      setShowErrorAlert(true)
      setMsg('Harap isi semua kolom input.')
      setTimeout(() => {
        setShowErrorAlert(false)
      }, 3000)
      return
    }

    try {
      const response = await axios.post('http://localhost:3005/add-data-pengunjung', inputValues)
      // console.log(response.data.message)
      setMsg(response.data.message)
      setShowSuccessAlert(true)
      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)

      setInputValues({
        nama: '',
        tipePengunjung: '',
        asal: '',
      })
    } catch (err) {
      console.log(err)
      setInputValues({
        nama: '',
        tipePengunjung: '',
        asal: '',
      })

      setShowErrorAlert(true)
      setTimeout(() => {
        setShowErrorAlert(false)
      }, 3000)
      setMsg(err.response.data.message)
    }
  }

  return (
    <div className="wrapper">
      <CCard style={{ width: '40rem' }}>
        {showSuccessAlert && (
          <CAlert color="success" className="d-flex align-items-center">
            <CIcon icon={cilCheckCircle} className="flex-shrink-0 me-2" width={24} height={24} />
            <div>{msg}</div>
          </CAlert>
        )}
        {showErrorAlert && (
          <CAlert color="danger" className="d-flex align-items-center">
            <CIcon icon={cilXCircle} className="flex-shrink-0 me-2" width={24} height={24} />
            <div>{msg}</div>
          </CAlert>
        )}
        <CCardHeader component="h3" style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Selamat Datang di Perpustakaan
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleAdd}>
            <CFormInput
              type="text"
              id="inputNama"
              floatingLabel="Nama Lengkap"
              placeholder="Nama Lengkap"
              name="nama"
              value={inputValues.nama}
              onChange={handleInputChange}
            />

            <CFormSelect
              name="tipePengunjung"
              id="tipePengunjung"
              floatingLabel="Tipe Pengunjung"
              aria-label="opsi tipe pengunjung seperti siswa, guru, atau tamu"
              className="pt-4"
              value={inputValues.tipePengunjung}
              onChange={handleInputChange}
            >
              {options.map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </CFormSelect>
            <CFormInput
              type="text"
              id="inputAsal"
              floatingLabel="Asal / Kelas"
              placeholder="Asal / Kelas"
              name="asal"
              value={inputValues.asal}
              onChange={handleInputChange}
            />
            <CButton type="submit">Berkunjung</CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default DataPengunjung
