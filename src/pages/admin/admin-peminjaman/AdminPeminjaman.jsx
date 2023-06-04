import React, { useEffect, useState } from 'react';
import './AdminPeminjaman.scss';
import { CButton, CCol, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CForm, CFormInput, CFormSelect } from '@coreui/react'
import { PageHeader } from './../../../component/admin-page-heaader/PageHeader';
import CIcon from '@coreui/icons-react';
import { cilSpreadsheet, cilTrash } from '@coreui/icons';
import axios from 'axios';
import { CDatePicker, CModal, CModalHeader, CModalBody, CModalTitle, CModalFooter } from '@coreui/react-pro'


const AdminPeminjaman = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [peminjaman, setPeminjaman] = useState([]);
  const [peminjamanDatas, setPeminjamanDatas] = useState(peminjaman);
  const [addFormData, setAddFormData] = useState({
    idBuku: null,
    namaPeminjam: null,
    judulBuku: null,
    tglKembali: null,
    tglPinjam: null,
    batasPinjam: null,
    status: null,
    denda: null,
  });
  const [currentId, setCurrentId] = useState('');
  const batalHandler = () => {
    setAddFormData({});
    setOpenModal(false);
    setOpenModalUpdate(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3005/peminjaman");
      setPeminjaman(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const formOnChangeHandler = (event) => {
    const fieldName = event.target.getAttribute('name');
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;
    console.log(fieldName);
    console.log(fieldValue);

    setAddFormData(newFormData);
    console.log(addFormData);
  }

  const formOnChangeTglPinjam = (value) => {
    value !== null ?
      setAddFormData(
        {
          ...addFormData,
          tglPinjam: value.toISOString().split('T')[0]
        }
      ) :
      setAddFormData(
        {
          ...addFormData,
          tglPinjam: null
        }
      )
  }

  const formOnChangeBatasPinjam = (value) => {
    value !== null ?
      setAddFormData(
        {
          ...addFormData,
          batasPinjam: value.toISOString().split('T')[0]
        }
      ) :
      setAddFormData(
        {
          ...addFormData,
          batasPinjam: null
        }
      )
  }

  const formOnChangeTglKembali = (value) => {
    value !== null ?
      setAddFormData(
        {
          ...addFormData,
          tglKembali: value.toISOString().split('T')[0]
        }
      ) :
      setAddFormData(
        {
          ...addFormData,
          tglKembali: null
        }
      )
  }

  const formOnSubmitHandler = (event) => {
    event.preventDefault();

    const newDataPeminjaman = {
      idBuku: addFormData.idBuku,
      namaPeminjam: addFormData.namaPeminjam,
      judulBuku: addFormData.judulBuku,
      tglKembali: addFormData.tglKembali,
      batasPinjam: addFormData.batasPinjam,
      tglPinjam: addFormData.tglPinjam,
      status: addFormData.status,
      denda: addFormData.denda,
    }

    console.log(newDataPeminjaman);
    const newDataPeminjamans = [...peminjamanDatas, newDataPeminjaman];
    setPeminjamanDatas(newDataPeminjamans);

    axios
      .post('http://localhost:3005/peminjaman', newDataPeminjaman)
      .then((res) => {
        console.log(res);
        setOpenModal(false);
        fetchData();
        setAddFormData({})
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleDelete = async (idPeminjaman) => {
    try {
      await axios.delete(`http://localhost:3005/peminjaman/${idPeminjaman}`);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const OnChangeKembali = async (idPeminjaman) => {
    const siswa = peminjaman.find((item) => item.idPeminjaman === idPeminjaman);
    const totalDenda = (tglKembaliDenda, batasPinjamDenda) => {
      const start = new Date(tglKembaliDenda);
      const end = new Date(batasPinjamDenda);

      const difference = start.getTime() - end.getTime();
      const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
      const chargePerDay = 3000;
      const totalCharge = chargePerDay * days;

      return totalCharge > 0 ? 'Rp. ' + totalCharge : '-';
    };

    const editedDataPeminjaman = {
      ...siswa,
      tglKembali: new Date().toISOString().split('T')[0],
      status: 'Dikembalikan',
      denda: totalDenda(siswa.tglKembali, siswa.batasPinjam)
    }

    try {
      await axios.put(`http://localhost:3005/peminjaman/${idPeminjaman}`, editedDataPeminjaman);
      fetchData();
    } catch (err) {
      console.error(err)
    }
    setAddFormData('')
  }

  const toggleUpdate = async (idPeminjaman) => {
    setOpenModalUpdate(!openModalUpdate);
    const siswa = peminjaman.find((item) => item.idPeminjaman === idPeminjaman);
    setCurrentId(siswa);
    console.log(currentId);
  }

  const formUpdateChangeHandler = (e) => {
    const { name, value } = e.target;
    setCurrentId(prevState => ({
      ...prevState,
      [name]: value
    }));
    console.log(currentId);
  }

  const formOnChangeDateHandler = (name, date) => {
    date !== null ?
      setCurrentId(prevState => ({
        ...prevState,
        [name]: date.toISOString().split('T')[0]
      }))
      :
      setCurrentId(prevState => ({
        ...prevState,
        [name]: null
      }))
      ;
  };

  const formUpdateHandler = async (event) => {
    event.preventDefault();

    try {
      await axios.put(`http://localhost:3005/peminjaman/${currentId.idPeminjaman}`, currentId);
      fetchData();
      batalHandler();
    }
    catch (err) {
      console.error(err)
    }
    console.log(currentId);
  }


  const [postPerPage] = useState(5);
  const [currentPage, setcurrentPage] = useState(1);
  const indexOfLastPage = currentPage * postPerPage;
  const indexOfFirstPage = indexOfLastPage - postPerPage;
  const currentPosts = peminjaman.slice(indexOfFirstPage, indexOfLastPage);

  const showPagination = () => {
    const pageNumbers = [];
    const totalPosts = peminjaman.length;

    for (let i = 1; i <= Math.ceil(totalPosts / postPerPage); i++) {
      pageNumbers.push(i);
    }

    const pagination = (pageNumbers) => {
      setcurrentPage(pageNumbers);
    }

    return (
      <nav>
        <ul className="pagination">
          {pageNumbers.map(number => (
            <li key={number} className={currentPage === number ? 'page-item active' : 'page-item'}>
              <button onClick={() => pagination(number)}> {number} </button>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  try {
    return (
      <>
        <PageHeader
          title="Data Peminjaman"
          icon={<CIcon icon={cilSpreadsheet} size='xl' />}
        />
        <div className="cardLayout">
          <CButton
            color="primary"
            size="lg"
            className="btnModal"
            onClick={() => {
              setOpenModal(!openModal);
            }}>Tambah Data Pinjam</CButton>

          <CModal allignment='center' size='lg' scrollable visible={openModal} onClose={() => batalHandler()}>
            <CModalHeader>
              <CModalTitle> Tambah Data Peminjaman</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CForm className="row g-3" onSubmit={formOnSubmitHandler}>
                <CCol md={6}>
                  <CFormInput name="namaPeminjam" type="text" id="inputNamaPeminjam" label="Nama Peminjam" onChange={formOnChangeHandler} />
                </CCol>
                <CCol md={6}>
                  <CFormInput name="idBuku" type="text" id="inputIdBuku" label="ID Buku" onChange={formOnChangeHandler} />
                </CCol>
                <CCol xs={12}>
                  <CFormInput name="judulBuku" id="inputJudulBuku" label="Judul Buku" placeholder="Si Kancil Bandel Banget" onChange={formOnChangeHandler} />
                </CCol>
                <CCol md={4}>
                  <CDatePicker name="tglPinjam" footer locale="en-US" id="tglPinjam" label="Tanggal Pinjam" onDateChange={formOnChangeTglPinjam} />
                </CCol>
                <CCol md={4}>
                  <CDatePicker name="batasPinjam" footer locale="en-US" id="batasPinjam" label="Batas Pinjam" onDateChange={formOnChangeBatasPinjam} />
                </CCol>
                <CCol md={4}>
                  <CDatePicker name="tglKembali" footer locale="en-US" id="tglKembali" label="Tanggal Kembali" onDateChange={formOnChangeTglKembali} />
                </CCol>
                <CCol md={8}>
                  <CFormSelect name="status" id="inputStatus" label="Status" onChange={formOnChangeHandler}>
                    <option>-</option>
                    <option>Belum Dikembalikan</option>
                    <option>Dikembalikan</option>
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormInput name="denda" id="inputDenda" label="Denda" onChange={formOnChangeHandler} />
                </CCol>
                <CModalFooter>
                  <CButton type="submit"> Tambah </CButton>
                  <CButton
                    color="light"
                    onClick={() => {
                      batalHandler()
                    }}> Kembali </CButton>
                </CModalFooter>
              </CForm>
            </CModalBody>
          </CModal>


          <table className="tableData">
            <thead>
              <tr>
                <th>No</th>
                <th>ID Pinjam </th>
                <th>ID Buku</th>
                <th>Peminjam</th>
                <th>Judul Buku</th>
                <th>Tanggal Pinjam</th>
                <th>Batas Pinjam</th>
                <th>Tanggal Kembali</th>
                <th>Status</th>
                <th>Denda</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((peminjaman, index) => (
                <tr key={peminjaman.idPeminjaman}>
                  <td>{postPerPage * (currentPage - 1) + index + 1}</td>
                  <td>{peminjaman.idPeminjaman}</td>
                  <td>{peminjaman.idBuku}</td>
                  <td>{peminjaman.namaPeminjam}</td>
                  <td>{peminjaman.judulBuku}</td>
                  <td>{peminjaman.tglPinjam}</td>
                  <td>{peminjaman.batasPinjam}</td>
                  <td>{peminjaman.tglKembali}</td>
                  <td>{peminjaman.status}</td>
                  <td>{peminjaman.denda}</td>
                  <td className='action'>
                    <div className="buttonWrapper">
                      <CDropdown>
                        <CDropdownToggle color="primary">Status</CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem onClick={() => OnChangeKembali(peminjaman.idPeminjaman)}>Kembalikan Buku</CDropdownItem>
                          <CDropdownItem onClick={() => { toggleUpdate(peminjaman.idPeminjaman) }}>Edit</CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                      <CButton color="danger" onClick={() => handleDelete(peminjaman.idPeminjaman)}><CIcon icon={cilTrash} size='lg' /></CButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className='paginationContainer'>
            {showPagination()}
          </div>
        </div>

        <CModal allignment='center' size='lg' scrollable visible={openModalUpdate} onClose={() => batalHandler()}>
          <CModalHeader>
            <CModalTitle> Edit Data Peminjaman</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className="row g-3" onSubmit={formUpdateHandler}>
              <CCol md={6}>
                <CFormInput value={currentId.namaPeminjam} name="namaPeminjam" type="text" id="inputNamaPeminjam" label="Nama Peminjam" onChange={formUpdateChangeHandler} />
              </CCol>
              <CCol md={6}>
                <CFormInput value={currentId.idBuku} name="idBuku" type="text" id="inputIdBuku" label="ID Buku" onChange={formUpdateChangeHandler} />
              </CCol>
              <CCol xs={12}>
                <CFormInput value={currentId.judulBuku} name="judulBuku" id="inputJudulBuku" label="Judul Buku" placeholder="Si Kancil Bandel Banget" onChange={formUpdateChangeHandler} />
              </CCol>
              <CCol md={4}>
                <CDatePicker date={currentId.tglPinjam} name="tglPinjam" footer locale="en-US" id="tglPinjam" label="Tanggal Pinjam" onDateChange={date => { formOnChangeDateHandler('tglPinjam', date) }} />
              </CCol>
              <CCol md={4}>
                <CDatePicker date={currentId.batasPinjam} name="batasPinjam" footer locale="en-US" id="batasPinjam" label="Batas Pinjam" onDateChange={date => { formOnChangeDateHandler('batasPinjam', date) }} />
              </CCol>
              <CCol md={4}>
                <CDatePicker date={currentId.tglKembali} name="tglKembali" footer locale="en-US" id="tglKembali" label="Tanggal Kembali" onDateChange={date => { formOnChangeDateHandler('tglKembali', date) }} />
              </CCol>
              <CCol md={8}>
                <CFormSelect value={currentId.status} name="status" id="inputStatus" label="Status" onChange={formUpdateChangeHandler}>
                  <option>-</option>
                  <option>Belum Dikembalikan</option>
                  <option>Dikembalikan</option>
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormInput value={currentId.denda} name="denda" id="inputDenda" label="Denda" onChange={formUpdateChangeHandler} />
              </CCol>
              <CModalFooter>
                <CButton type="submit"> Simpan </CButton>
                <CButton
                  color="light"
                  onClick={() => {
                    batalHandler()
                  }}> Kembali </CButton>
              </CModalFooter>
            </CForm>
          </CModalBody>
        </CModal>
      </>
    )
  } catch (e) {
    alert(e.message);
  }
}

export default AdminPeminjaman