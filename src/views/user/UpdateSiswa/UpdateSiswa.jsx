import React, { Suspense, useEffect, useState } from 'react'
import { NavbarComponent } from 'src/component/index'
import {
  CCard,
  CCardBody,
  CAlert,
  CSpinner,
  CFormInput,
  CInputGroup,
  CButton,
  CAvatar,
  CForm,
  CImage,
  CFooter,
  CLink,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CBadge,
  CSmartTable,
} from '@coreui/react-pro'
import axios from 'axios'
import './updateSiswa.scss'
import CIcon from '@coreui/icons-react'
import { cilToggleOff, cilToggleOn, cilCheckCircle, cilXCircle } from '@coreui/icons'

const UpdateSiswa = () => {
  const formatDate = (dateString) => {
    const dateObject = new Date(dateString)
    const year = dateObject.getFullYear()
    const month = String(dateObject.getMonth() + 1).padStart(2, '0')
    const day = String(dateObject.getDate()).padStart(2, '0')
    const time = dateObject.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

    return `${year}-${month}-${day}, ${time}`
  }
  const [loading, setLoading] = useState()

  const [id, setId] = useState('')
  const [nama, setNama] = useState('')
  // const [status, setStatus] = useState('')
  // const [jurusan, setJurusan] = useState('')
  const [jumlahPinjam, setJumlahPinjam] = useState('')
  const [dataPinjam, setDataPinjam] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confPassword, setConfPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfPassword, setShowConfPassword] = useState(false)

  const [msg, setMsg] = useState(null)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword)
  }
  const toggleConfPasswordVisibility = () => {
    setShowConfPassword(!showConfPassword)
  }

  useEffect(() => {
    const getPeminjamanOnSiswa = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/peminjaman/${id}`)
        // console.log(response.data.data)
        setJumlahPinjam(response.data.data.length)
        setDataPinjam(response.data.data)
      } catch (err) {
        console.log(err)
      }
    }

    getSiswa()
    getPeminjamanOnSiswa()
    setLoading(false)
  }, [id])

  const column = [
    {
      key: 'No',
      _style: { width: '1%' },
      filter: false,
      sorter: false,
    },
    {
      key: 'Buku_kodeBuku',
      _style: { width: '7%' },
      label: 'Kode Buku',
    },
    { key: 'nama', _style: { width: '15%' } },
    { key: 'judul', _style: { width: '15%' } },
    { key: 'tglPinjam', _style: { width: '10%' } },
    { key: 'batasPinjam', _style: { width: '12%' } },
    { key: 'tglKembali', _style: { width: '11%' } },
    { key: 'status', _style: { width: '10%' } },
    { key: 'denda', _style: { width: '10%' } },
    { key: 'createdAt', _style: { width: '10%' }, label: 'Tercatat Pada' },
  ]

  const getBadge = (status) => {
    switch (status) {
      case 'Dikembalikan':
        return 'primary'
      case 0:
        return 'secondary'
      case 'Lunas':
        return 'success'
      case 'Belum Dikembalikan':
        return 'danger'
      default:
        return 'primary'
    }
  }

  const getSiswa = async () => {
    try {
      const refreshTokenSiswa = localStorage.getItem('refreshTokenSiswa')
      const response = await axios.get(`http://localhost:3005/siswa/${refreshTokenSiswa}`)
      setNama(response.data.data[0].nama)
      setId(response.data.data[0].siswa_NIS)
      // setJurusan(response.data.data[0].Jurusan)
      console.log(response.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    const siswaId = id

    const updatePasswordData = {
      prevPassword: password,
      newPassword: newPassword,
      confirmNewPassword: confPassword,
    }
    console.log(updatePasswordData)

    try {
      const response = await axios.put(
        `http://localhost:3005/siswa-update/${siswaId}`,
        updatePasswordData,
      )
      setShowSuccessAlert(true)
      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)
      setMsg(response.data.message)
    } catch (err) {
      setShowErrorAlert(true)

      setTimeout(() => {
        setShowErrorAlert(false)
      }, 3000)
      setMsg(err.response.data.message)
    }
  }
  return (
    <Suspense fallback={<CSpinner color="primary" />}>
      <NavbarComponent />
      <div className="wrapper">
        <CCard>
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
          <CCardBody>
            <div className="profileSiswa">
              <div className="avatarName">
                <CAvatar
                  // eslint-disable-next-line prettier/prettier
                  src={`https://ui-avatars.com/api/?name=${nama ? nama : undefined}&background=random`}
                  size="xl"
                />
                <div className="name">
                  <p>User</p>
                  <h2>{nama}</h2>
                </div>
              </div>
              <div className="infoUser">
                <div className="infoLabel">
                  <p>NIS</p>
                  <h5>{id}</h5>
                </div>
                {/* <div className="infoLabel">
                  <p>Jurusan / Ruang</p>
                  <h5>{jurusan}</h5>
                </div> */}
                <div className="infoLabel">
                  <p>Jumlah Pinjam</p>
                  <h5>{jumlahPinjam}</h5>
                </div>
              </div>
            </div>

            <CAccordion className="mt-2">
              <CAccordionItem>
                <CAccordionHeader> Ubah password anda disini</CAccordionHeader>
                <CAccordionBody>
                  <CForm onSubmit={handleUpdate} className="form-updateSiswa">
                    <h4>Form Ubah Password</h4>
                    <label htmlFor="floatingPassword"> Old Password </label>
                    <CInputGroup>
                      <CFormInput
                        className="rounded-1"
                        type={showPassword ? 'text' : 'password'}
                        id="floatingPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <CButton
                        className="rounded-1"
                        type="button"
                        color="secondary"
                        variant="outline"
                        onClick={togglePasswordVisibility}
                      >
                        <CIcon icon={showPassword ? cilToggleOn : cilToggleOff} size="xl" />
                      </CButton>
                    </CInputGroup>
                    <label htmlFor="floatingNewPassword"> New Password </label>
                    <CInputGroup>
                      <CFormInput
                        className="rounded-1"
                        type={showNewPassword ? 'text' : 'password'}
                        id="floatingNewPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <CButton
                        className="rounded-1"
                        type="button"
                        color="secondary"
                        variant="outline"
                        onClick={toggleNewPasswordVisibility}
                      >
                        <CIcon icon={showNewPassword ? cilToggleOn : cilToggleOff} size="xl" />
                      </CButton>
                    </CInputGroup>
                    <label htmlFor="floatingConfPassword"> Confirm New Password </label>
                    <CInputGroup>
                      <CFormInput
                        className="rounded-1"
                        type={showConfPassword ? 'text' : 'password'}
                        id="floatingConfPassword"
                        value={confPassword}
                        onChange={(e) => setConfPassword(e.target.value)}
                      />
                      <CButton
                        className="rounded-1"
                        type="button"
                        color="secondary"
                        variant="outline"
                        onClick={toggleConfPasswordVisibility}
                      >
                        <CIcon icon={showConfPassword ? cilToggleOn : cilToggleOff} size="xl" />
                      </CButton>
                    </CInputGroup>
                    <button className="btnDaftar">Simpan Perubahan </button>
                  </CForm>
                </CAccordionBody>
              </CAccordionItem>
            </CAccordion>

            <CSmartTable
              className="mt-3"
              activePage={3}
              footer
              clickableRows
              columns={column}
              columnSorter
              loading={loading}
              items={dataPinjam}
              itemsPerPageSelect
              itemsPerPage={5}
              pagination
              sorterValue={{ column: 'name', state: 'asc' }}
              tableHeadProps={{
                color: 'info',
              }}
              tableProps={{
                hover: true,
                responsive: true,
              }}
              scopedColumns={{
                No: (item, index) => {
                  const itemNumber = index + 1
                  return <td>{itemNumber}</td>
                },
                status: (item) => (
                  <td>
                    <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
                  </td>
                ),
                createdAt: (item) => {
                  return <td className="py-2">{formatDate(item.createdAt)}</td>
                },
              }}
            />
          </CCardBody>
        </CCard>
      </div>
      <CFooter>
        <CImage className="logo" rounded src="/images/logouper.png" />
        <div style={{ fontFamily: 'Poppins' }}>
          <span className="ms-1"> Copyright &copy; 2023 Pengabdian Kepada Masyarakat</span>
          <CLink href="https://universitaspertamina.ac.id/" target="_blank" rel="noreferrer">
            Universitas Pertamina
          </CLink>
        </div>
      </CFooter>
    </Suspense>
  )
}

export default UpdateSiswa
