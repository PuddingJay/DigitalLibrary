import React, { useState, useEffect, useRef } from 'react'
import '../admin-dataAnggota/AdminDataAnggota.scss'
import { CButton } from '@coreui/react-pro'
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

const AdminDataAnggota = () => {
  // const [openModal, setOpenModal] = useState(false);
  const [DataAnggota, setDataAnggota] = useState([])
  const [NIS, setNIS] = useState([])
  const [Nama, setNama] = useState([])
  const [Kelas, setKelas] = useState([])
  const [Jurusan, setJurusan] = useState([])
  const [modalTambah, setModalTambah] = useState(false)
  const [modalUpdate, setModalUpdate] = useState(false)
  const [currentAnggotaId, setCurrentAnggotaId] = useState(null)

  const formRef = useRef(null)

  useEffect(() => {
    fetchData()
  }, [])

  const toggleModalTambah = () => {
    setNIS('')
    setNama('')
    setKelas('')
    setJurusan('')

    setModalTambah(!modalTambah)
  }

  const toggleModalUpdate = () => {
    setModalUpdate(!modalUpdate)
  }

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3005/siswa')
      setDataAnggota(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAdd = (e) => {
    e.preventDefault()

    const formData = { NIS, Nama, Kelas, Jurusan }

    axios
      .post('http://localhost:3005/siswa', formData)
      .then(() => {
        toggleModalTambah()
        fetchData()
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleDelete = async (NIS) => {
    try {
      await axios.delete(`http://localhost:3005/siswa/${NIS}`)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async () => {
    const formData = { NIS, Nama, Kelas, Jurusan }

    try {
      console.log(`http://localhost:3005/siswa/${NIS}`)
      console.log(formData)
      await axios.put(`http://localhost:3005/siswa/${currentAnggotaId}`, formData)
      toggleModalUpdate()
      fetchData()

      // Perbarui data buku yang sudah dirubah dengan data baru
      setDataAnggota((prevData) => {
        return prevData.map((item) => {
          if (item.NIS === currentAnggotaId) {
            return {
              ...item,
              NIS: NIS,
              Nama: Nama,
              Kelas: Kelas,
              Jurusan: Jurusan,
            }
          }
          return item
        })
      })

      // Setel ulang nilai input menjadi kosong atau nilai default
      setNIS('')
      setNama('')
      setKelas('')
      setJurusan('')
    } catch (error) {
      console.error(error)
    }
  }

  const toggleModal = (NIS) => {
    const siswa = DataAnggota.find((item) => item.NIS === NIS)
    console.log('siswa =' + siswa)
    console.log('Nama siswa =' + siswa.Nama)
    setCurrentAnggotaId(siswa)
    setNIS(siswa.NIS)
    setNama(siswa.Nama)
    setKelas(siswa.Kelas)
    setJurusan(siswa.Jurusan)
    setModalUpdate(!modalUpdate)
  }

  try {
    return (
      <>
        <div className="cardLayout">
          <CButton color="primary" size="lg" className="btnModal" onClick={toggleModalTambah}>
            Tambah Data Anggota
          </CButton>

          <Modal isOpen={modalTambah} toggle={toggleModalTambah}>
            <ModalHeader toggle={toggleModalTambah}>Tambah Anggota</ModalHeader>
            <ModalBody>
              <Form innerRef={formRef}>
                <FormGroup>
                  <Label for="NIS">NIS</Label>
                  <Input
                    type="text"
                    name="NIS"
                    id="NIS"
                    value={NIS}
                    onChange={(e) => setNIS(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="Nama">Nama Lengkap</Label>
                  <Input
                    type="text"
                    name="Nama"
                    id="Nama"
                    value={Nama}
                    onChange={(e) => setNama(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="Kelas">Kelas</Label>
                  <Input
                    type="text"
                    placeholder="contoh 10"
                    name="Kelas"
                    id="Kelas"
                    value={Kelas}
                    onChange={(e) => setKelas(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="Jurusan">Jurusan</Label>
                  <Input
                    type="text"
                    name="Jurusan"
                    placeholder="IPA-1"
                    id="Jurusan"
                    value={Jurusan}
                    onChange={(e) => setJurusan(e.target.value)}
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
              Form {currentAnggotaId ? 'Edit' : 'Edit'} Data
            </ModalHeader>
            <ModalBody>
              <Form innerRef={formRef}>
                <FormGroup></FormGroup>
                <FormGroup>
                  <Label for="Nama">Nama Lengkap</Label>
                  <Input
                    type="text"
                    name="Nama"
                    id="Nama"
                    value={Nama}
                    onChange={(e) => setNama(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="Kelas">Kelas</Label>
                  <Input
                    type="text"
                    placeholder="contoh 10"
                    name="Kelas"
                    id="Kelas"
                    value={Kelas}
                    onChange={(e) => setKelas(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="Jurusan">Jurusan</Label>
                  <Input
                    type="text"
                    name="Jurusan"
                    placeholder="IPA-1"
                    id="Jurusan"
                    value={Jurusan}
                    onChange={(e) => setJurusan(e.target.value)}
                  />
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                color="primary"
                onClick={currentAnggotaId ? () => handleUpdate(currentAnggotaId) : handleAdd}
              >
                Simpan
              </Button>
              <Button color="secondary" onClick={toggleModalUpdate}>
                Batal
              </Button>
            </ModalFooter>
          </Modal>

          <table>
            <thead>
              <tr>
                <th>S/N</th>
                <th>NIS</th>
                <th>Nama</th>
                <th>Kelas</th>
                <th>Jurusan</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {DataAnggota.map((item, index) => (
                <tr key={item.NIS}>
                  <td>{index + 1}</td>
                  <td>{item.NIS}</td>
                  <td>{item.Nama}</td>
                  <td>{item.Kelas}</td>
                  <td>{item.Jurusan}</td>
                  <td className="action">
                    <div className="buttonWrapper">
                      <CButton onClick={() => handleDelete(item.NIS)} color="danger">
                        Hapus
                      </CButton>
                      <CButton onClick={() => toggleModal(item.NIS)} color="dark">
                        Edit
                      </CButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )
  } catch (e) {
    alert(e.message)
  }
}

export default AdminDataAnggota
