/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import './AdminPeminjaman.scss'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CCollapse,
  CForm,
  CFormInput,
  CFormSelect,
  CSmartTable,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CDatePicker,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
} from '@coreui/react-pro'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilCheckCircle } from '@coreui/icons'
import * as XLSX from 'xlsx'

const AdminPeminjaman = () => {
  const [msg, setMsg] = useState(null)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatCreatedDate = (dateString) => {
    if (!dateString) return "";

    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const time = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

    return `${year}-${month}-${day} Pukul: ${time}`;
  };

  const today = formatDate(new Date());

  const [loading, setLoading] = useState()
  const [openModal, setOpenModal] = useState(false)
  const [openModalUpdate, setOpenModalUpdate] = useState(false)
  const [peminjaman, setPeminjaman] = useState([])
  const [books, setBooks] = useState([])
  const [siswas, setSiswas] = useState([])
  const [peminjamanDatas, setPeminjamanDatas] = useState(peminjaman)
  const [batasPinjamPerHari, setBatasPinjamPerHari] = useState(() => {
    const storedBatasPinjamPerHari = localStorage.getItem('batasPinjamPerHari');
    return storedBatasPinjamPerHari ? parseInt(storedBatasPinjamPerHari) : 7;
  });
  const [currentId, setCurrentId] = useState('')
  const [hargaDenda, setHargaDenda] = useState(() => {
    const storedHargaDenda = localStorage.getItem('hargaDenda');
    return storedHargaDenda ? parseInt(storedHargaDenda) : 500;
  });
  const [addFormData, setAddFormData] = useState({
    kodeBuku: null,
    NIS: null,
    namaPeminjam: null,
    judulBuku: null,
    tglKembali: null,
    tglPinjam: today,
    batasPinjam: formatDate(
      new Date(new Date(today).getTime() + batasPinjamPerHari * 24 * 60 * 60 * 1000)
    ),
    status: "Belum Dikembalikan",
    denda: '',
  })


  useEffect(() => {
    // Calculate 'peminjaman.batasPinjam' whenever batasPinjamPerHari or tglPinjam changes
    if (addFormData.tglPinjam) {
      setAddFormData((prevFormData) => ({
        ...prevFormData,
        batasPinjam: formatDate(new Date(new Date(prevFormData.tglPinjam).getTime() + (batasPinjamPerHari * 24 * 60 * 60 * 1000))),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batasPinjamPerHari, formatDate(addFormData.tglPinjam)]);

  const batalHandler = () => {
    setAddFormData({
      ...addFormData,
      status: "Belum Dikembalikan",
      tglPinjam: today,
      kodeBuku: null,
      NIS: null,
      namaPeminjam: null,
      judulBuku: null,
      tglKembali: null,
      batasPinjam: formatDate(
        new Date(new Date(today).getTime() + batasPinjamPerHari * 24 * 60 * 60 * 1000)
      ),
      denda: '',
    });
    setOpenModal(false);
    setOpenModalUpdate(false);
  };

  useEffect(() => {
    localStorage.setItem('hargaDenda', hargaDenda.toString());
    localStorage.setItem('batasPinjamPerHari', batasPinjamPerHari.toString());
  }, [hargaDenda, batasPinjamPerHari]);

  useEffect(() => {
    fetchData()
    fetchBooks()
    fetchSisws()
    setLoading(false)
    console.log(addFormData)
    console.log(currentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchNamaSiswa = async () => {
    const sisw = siswas.find((item) => item.NIS === addFormData.NIS);
    const NISSiswa = sisw ? sisw.NIS : null;

    setAddFormData((prevFormData) => ({
      ...prevFormData,
      NIS: NISSiswa,
    }));
    console.log(sisw);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3005/peminjaman');
      const updatedPeminjaman = response.data.data.map((item) => {
        if (
          item.status === 'Belum Dikembalikan' &&
          new Date(item.batasPinjam) < new Date()
        ) {
          const startDate = new Date(item.batasPinjam);
          const endDate = new Date();
          const differenceInDays = Math.ceil(
            (endDate - startDate) / (1000 * 60 * 60 * 24)
          );
          item.denda = `Rp. ${differenceInDays * hargaDenda}`

          axios.put(`http://localhost:3005/peminjaman/${item.idPeminjaman}`, item);
        }
        return item;
      });
      setPeminjaman(updatedPeminjaman);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchBooks = async () => {
    try {
      const responseBook = await axios.get('http://localhost:3005/book');
      setBooks(responseBook.data?.data ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSisws = async () => {
    try {
      const responseSiswa = await axios.get('http://localhost:3005/siswa');
      setSiswas(responseSiswa.data?.data ?? []);
      console.log(responseSiswa.data.data)
    } catch (error) {
      console.log(error);
    }
  };

  const hargaDendaOnChangeHandler = (event) => {
    const fieldValue = event.target.value;
    setHargaDenda(fieldValue);
  };

  const calculateDenda = (tglKembali, batasPinjam) => {
    const start = new Date(tglKembali);
    const end = new Date(batasPinjam);

    const difference = start.getTime() - end.getTime();
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
    const chargePerDay = hargaDenda;
    const totalCharge = chargePerDay * days;

    return totalCharge > 0 ? 'Rp. ' + totalCharge : 0;
  };

  const formOnChangeHandler = (event) => {
    const fieldName = event.target.getAttribute('name')
    const fieldValue = event.target.value

    let newFormData;
    if (fieldName === 'kodeBuku') {
      const book = books.find((item) => item.kodeBuku === fieldValue);
      const judulBuku = book ? book.judul : null;

      newFormData = {
        ...addFormData,
        kodeBuku: fieldValue,
        judulBuku: judulBuku,
      };
    } else if (fieldName === 'NIS') {
      const nisValue = parseInt(fieldValue);
      const sisw = siswas.find((item) => item.NIS === nisValue);
      const namaSiswa = sisw ? sisw.Nama : null;

      newFormData = {
        ...addFormData,
        NIS: nisValue,
        namaPeminjam: namaSiswa,
      };
    } else if (fieldName === 'status') {
      if (fieldValue === 'Dikembalikan') {
        const denda = calculateDenda(
          addFormData.tglKembali,
          addFormData.batasPinjam
        );

        newFormData = {
          ...addFormData,
          [fieldName]: fieldValue,
          denda: denda,
        };
      } else {
        newFormData = {
          ...addFormData,
          [fieldName]: fieldValue,
          denda: 0,
        };
      }
    } else {
      newFormData = {
        ...addFormData,
        [fieldName]: fieldValue,
      }
    }
    console.log(fieldName, fieldValue)
    console.log(newFormData)

    setAddFormData(newFormData)
  }

  const formOnChangeTglPinjam = (value) => {
    value !== null
      ? setAddFormData({
        ...addFormData,
        tglPinjam: formatDate(value),
      })
      : setAddFormData({
        ...addFormData,
        tglPinjam: null,
      })
  }

  const formOnChangeBatasPinjam = (value) => {
    console.log('Received value:', value);
    value !== null
      ? setAddFormData({
        ...addFormData,
        batasPinjam: formatDate(value),
      })
      : setAddFormData({
        ...addFormData,
        batasPinjam: null,
      })
  }

  const formOnChangeTglKembali = (value) => {
    value !== null
      ? setAddFormData({
        ...addFormData,
        tglKembali: formatDate(value),
      })
      : setAddFormData({
        ...addFormData,
        tglKembali: null,
      })
  }

  const formOnSubmitHandler = (event) => {
    event.preventDefault();

    fetchNamaSiswa(); // Fetch the namaSiswa value based on the NIS

    if (
      !addFormData.kodeBuku ||
      !addFormData.NIS ||
      !addFormData.namaPeminjam ||
      !addFormData.judulBuku ||
      !addFormData.tglPinjam ||
      !addFormData.batasPinjam ||
      !addFormData.status
    ) {
      // Handle the error here (e.g., show a message to the user)
      alert("Kolom yang harus diisi tidak boleh kosong");
      return;
    }

    const newDataPeminjaman = {
      kodeBuku: addFormData.kodeBuku,
      NIS: addFormData.NIS,
      namaPeminjam: addFormData.namaPeminjam,
      judulBuku: addFormData.judulBuku,
      tglKembali: addFormData.tglKembali,
      batasPinjam: addFormData.batasPinjam,
      tglPinjam: addFormData.tglPinjam,
      status: addFormData.status,
      denda: addFormData.denda,
    };

    console.log(newDataPeminjaman);
    const newDataPeminjamans = [...peminjamanDatas, newDataPeminjaman];
    setPeminjamanDatas(newDataPeminjamans);

    axios
      .post('http://localhost:3005/peminjaman', newDataPeminjaman)
      .then((res) => {
        console.log(res);
        setOpenModal(false);
        fetchData();
        setAddFormData({});
        setMsg(res.data.message);
        setShowSuccessAlert(true)

        setTimeout(() => {
          setShowSuccessAlert(false)
        }, 3000)
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          alert('Buku Tidak Tersedia');
        }
        console.log(err);
      });
  };

  const handleDelete = async (idPeminjaman) => {
    try {
      const response = await axios.delete(`http://localhost:3005/peminjaman/${idPeminjaman}`)
      fetchData()
      setMsg(response.data.message);
      setShowSuccessAlert(true)

      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)
    } catch (err) {
      console.log(err)
    }
  }

  const OnChangeKembali = async (idPeminjaman) => {
    const siswa = peminjaman.find((item) => item.idPeminjaman === idPeminjaman)

    const editedDataPeminjaman = {
      ...siswa,
      tglKembali: siswa.tglKembali === null ? formatDate(new Date()) : formatDate(siswa.tglKembali),
      status: 'Dikembalikan',
      denda: calculateDenda(formatDate(siswa.tglKembali), formatDate(siswa.batasPinjam)),
    };
    try {
      await axios.put(`http://localhost:3005/peminjaman/${idPeminjaman}`, editedDataPeminjaman)
      fetchData()
      setAddFormData(siswa);
      console.log(editedDataPeminjaman);
    } catch (err) {
      console.error(err)
    }
    setAddFormData('')
  }

  const toggleUpdate = async (idPeminjaman) => {
    setOpenModalUpdate(!openModalUpdate)
    const siswa = peminjaman.find((item) => item.idPeminjaman === idPeminjaman)
    setCurrentId(siswa)
    console.log(currentId)
  }

  const formUpdateChangeHandler = (e) => {
    const { name, value } = e.target
    setCurrentId((prevState) => ({
      ...prevState,
      [name]: value,
    }))

    if (name === 'NIS') {
      const nisValue = parseInt(value)
      const sisw = siswas.find((item) => item.NIS === nisValue)
      if (sisw) {
        setCurrentId((prevState) => ({
          ...prevState,
          namaPeminjam: sisw.Nama,
        }))
      }
    } else if (name === 'kodeBuku') {
      const book = books.find((item) => item.kodeBuku === value)
      if (book) {
        setCurrentId((prevState) => ({
          ...prevState,
          judulBuku: book.judul,
        }));
      }
    } else if (name === 'status') {
      if (value === 'Dikembalikan') {
        const denda = calculateDenda(
          formatDate(currentId.tglKembali),
          formatDate(currentId.batasPinjam)
        );

        setCurrentId((prevState) => ({
          ...prevState,
          denda: denda,
        }));
      } else {
        setCurrentId((prevState) => ({
          ...prevState,
          denda: 0,
        }))
      }
    }

    console.log(currentId);
  };

  const formOnChangeDateHandler = (name, date) => {
    const formattedDate = date ? formatDate(date) : null;
    setCurrentId((prevState) => ({
      ...prevState,
      [name]: formattedDate,
    }));
    console.log(currentId);
  };

  const formUpdateHandler = async (event) => {
    event.preventDefault()

    try {
      const formattedData = {
        ...currentId,
        tglPinjam: formatDate(currentId.tglPinjam),
        batasPinjam: formatDate(currentId.batasPinjam),
        tglKembali: formatDate(currentId.tglKembali) ? formatDate(currentId.tglKembali) : null,
      };
      const response = await axios.put(`http://localhost:3005/peminjaman/${currentId.idPeminjaman}`, formattedData)
      fetchData()
      setMsg(response.data.message);
      setShowSuccessAlert(true)

      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)
      batalHandler()
    } catch (err) {
      if (err.response && err.response.status === 404) {
        alert('Buku Tidak Tersedia');
      }
      console.error(err)
    }
  }

  const handleDibayar = async (idPeminjaman) => {
    const peminjamanData = peminjaman.find(
      (item) => item.idPeminjaman === idPeminjaman
    );

    const editedDataPeminjaman = {
      ...peminjamanData,
      status: "Lunas",
      denda: 0,
    };

    try {
      await axios.put(
        `http://localhost:3005/peminjaman/${idPeminjaman}`,
        editedDataPeminjaman
      );
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const [details, setDetails] = useState([])
  const columns = [
    {
      key: 'No',
      _style: { width: '5%' },
      filter: false,
      sorter: false,
    },
    {
      key: 'kodeBuku',
      _style: { width: '10%' },
    },
    { key: 'namaPeminjam', _style: { width: '17%' } },
    { key: 'judulBuku', _style: { width: '18%' } },
    { key: 'tglPinjam', _style: { width: '10%' } },
    { key: 'batasPinjam', _style: { width: '10%' } },
    { key: 'tglKembali', _style: { width: '10%' } },
    { key: 'status', _style: { width: '12%' } },
    { key: 'denda', _style: { width: '13%' } },
    {
      key: 'show_details',
      label: 'Aksi',
      _style: { width: '1%' },
      filter: false,
      sorter: false,
    },
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
  const getExcelData = () => {
    if (!peminjaman || !peminjaman[0]) {
      alert('Tidak bisa download data kosong')
      return new Blob()
    }
    const header = Object.keys(peminjaman[0])
    const data = peminjaman.map((item) => {
      const formattedPeminjaman = formatCreatedDate(item.createdAt)
      return header.map((column) => {
        if (column === 'createdAt') {
          return formattedPeminjaman
        }
        return item[column]
      })
    })

    const ws = XLSX.utils.aoa_to_sheet([header, ...data])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    return blob
  }

  const downloadExcel = () => {
    const blob = getExcelData()
    if (blob.size > 0) {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'data-peminjaman.xlsx'
      link.click()
    }
  }

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
            <div className="actionPeminjaman">
              <div className="form-container">
                <CButton
                  color="primary"
                  size="lg"
                  className="btnModal"
                  onClick={() => {
                    setOpenModal(!openModal);
                  }}
                >
                  Tambah Data Pinjam
                </CButton>
                <CInputGroup>
                  <CForm>
                    <CFormInput
                      name="batasPinjamPerHari"
                      type="number"
                      size="lg"
                      id="inputBatasPinjamPerHarii"
                      value={batasPinjamPerHari} // Display the value from the state
                      onChange={(e) => setBatasPinjamPerHari(parseInt(e.target.value))} // Update the state when the input changes
                      floatingLabel="Batas Peminjaman"
                    />
                  </CForm>
                  <CInputGroupText id="batasPeminjamanPerHari">Hari</CInputGroupText>
                </CInputGroup>
                <CForm>
                  <CFormInput
                    name="hargaDenda"
                    type="number"
                    size="lg"
                    id="inputHargaDenda"
                    floatingLabel="Denda/Hari"
                    value={hargaDenda}
                    onChange={hargaDendaOnChangeHandler}
                  />
                </CForm>
              </div>
              <div className="download-container">
                <CButton
                  className="download-button"
                  color="primary"
                  onClick={downloadExcel}
                  target="_blank"
                  size="lg"
                >
                  <CIcon icon={cilCloudDownload} size="lg" />
                </CButton>
              </div>
            </div>

            <CSmartTable
              className="mt-3"
              activePage={3}
              cleaner
              footer
              clickableRows
              columns={columns}
              loading={loading}
              columnSorter
              items={peminjaman}
              itemsPerPageSelect
              itemsPerPage={5}
              pagination
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
                show_details: (item) => {
                  return (
                    <td className="py-2">
                      <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => {
                          toggleDetails(item.idPeminjaman)
                        }}
                      >
                        {details.includes(item.idPeminjaman) ? 'Hide' : 'Show'}
                      </CButton>
                    </td>
                  )
                },
                details: (item) => {
                  return (
                    <CCollapse visible={details.includes(item.idPeminjaman)}>
                      <CCardBody className="p-3">
                        <h4>Buku {item.judulBuku} ( {item.kodeBuku} ) </h4>
                        <p className="text-muted">Dicatat pada tanggal: {formatCreatedDate(item.createdAt)} Oleh {item.namaPeminjam} ({item.NIS})</p>
                        <CButton
                          size="sm"
                          color="dark"
                          onClick={() => {
                            toggleUpdate(item.idPeminjaman)
                          }}
                        >
                          Edit
                        </CButton>
                        <CButton
                          size="sm"
                          color="primary"
                          onClick={() => OnChangeKembali(item.idPeminjaman)}
                        >
                          Dikembalikan
                        </CButton>
                        <CButton
                          size="sm"
                          color="success"
                          onClick={() => handleDibayar(item.idPeminjaman)}
                        >
                          Dibayar
                        </CButton>
                        <CButton
                          size="sm"
                          color="danger"
                          onClick={() => {
                            const shouldDelete = window.confirm(
                              'Apakah Anda yakin ingin menghapus data ini?',
                            )
                            if (shouldDelete) {
                              handleDelete(item.idPeminjaman)
                            }
                          }
                          }
                        >
                          Delete
                        </CButton>
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
                // striped: true,
                hover: true,
                responsive: true,
              }}
            />
          </CCardBody>
        </CCard>

        <CModal
          alignment="center"
          size="lg"
          scrollable
          visible={openModal}
          onClose={() => batalHandler()}
        >
          <CModalHeader>
            <CModalTitle>Tambah Data Peminjaman</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className="row g-3" onSubmit={formOnSubmitHandler}>
              <CCol md={3}>
                <CFormInput
                  name="NIS"
                  type="text"
                  id="inputNIS"
                  label="NIS"
                  onChange={formOnChangeHandler}
                />
              </CCol>
              <CCol md={9}>
                <CFormInput
                  name="namaPeminjam"
                  type="text"
                  id="inputNamaPeminjam"
                  label="Nama Peminjam"
                  value={addFormData.namaPeminjam || ''}
                  // onChange={formOnChangeHandler}
                  readOnly
                />
              </CCol>
              <CCol md={2}>
                <CFormInput
                  name="kodeBuku"
                  type="text"
                  id="inputKodeBuku"
                  label="Kode Buku"
                  onChange={formOnChangeHandler}
                // onBlur={fetchJudulBuku}
                />
              </CCol>
              <CCol xs={10}>
                <CFormInput
                  name="judulBuku"
                  id="inputJudulBuku"
                  label="Judul Buku"
                  value={addFormData.judulBuku || ''}
                  placeholder="Judul Buku"
                  readOnly
                />
              </CCol>
              <CCol md={4}>
                <CDatePicker
                  name="tglPinjam"
                  footer
                  locale="id-ID"
                  id="tglPinjam"
                  label="Tanggal Pinjam"
                  value={addFormData.tglPinjam}
                  date={today}
                  onDateChange={formOnChangeTglPinjam}
                />
              </CCol>
              <CCol md={4}>
                <CDatePicker
                  name="batasPinjam"
                  footer
                  locale="id-ID"
                  id="batasPinjam"
                  label="Batas Pinjam"
                  date={addFormData.batasPinjam}
                  onDateChange={formOnChangeBatasPinjam}
                />
              </CCol>
              <CCol md={4}>
                <CDatePicker
                  name="tglKembali"
                  footer
                  locale="id-ID"
                  id="tglKembali"
                  label="Tanggal Kembali"
                  onDateChange={formOnChangeTglKembali}
                />
              </CCol>
              <CCol md={8}>
                <CFormSelect
                  name="status"
                  id="inputStatus"
                  label="Status"
                  value={addFormData.status}
                  onChange={formOnChangeHandler}
                  text="* Pilih Status"
                >
                  <option>Belum Dikembalikan</option>
                  <option>Dikembalikan</option>
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormInput
                  name="denda"
                  id="inputDenda"
                  label="Denda"
                  onChange={formOnChangeHandler}
                />
              </CCol>
              <CModalFooter>
                <CButton type="submit"> Tambah </CButton>
                <CButton
                  color="light"
                  onClick={() => {
                    batalHandler()
                  }}
                >
                  {' '}
                  Kembali{' '}
                </CButton>
              </CModalFooter>
            </CForm>
          </CModalBody>
        </CModal>

        <CModal
          alignment="center"
          size="lg"
          scrollable
          visible={openModalUpdate}
          onClose={() => batalHandler()}
        >
          <CModalHeader>
            <CModalTitle> Edit Data Peminjaman</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className="row g-3" onSubmit={formUpdateHandler}>
              <CCol md={3}>
                <CFormInput
                  value={currentId.NIS}
                  name="NIS"
                  type="text"
                  id="inputNIS"
                  label="NIS"
                  onChange={formUpdateChangeHandler}
                />
              </CCol>
              <CCol md={9}>
                <CFormInput
                  value={currentId.namaPeminjam}
                  name="namaPeminjam"
                  type="text"
                  id="inputNamaPeminjam"
                  label="Nama Peminjam"
                  onChange={formUpdateChangeHandler}
                />
              </CCol>
              <CCol md={2}>
                <CFormInput
                  value={currentId.kodeBuku}
                  name="kodeBuku"
                  type="text"
                  id="inputIdBuku"
                  label="Kode Buku"
                  onChange={formUpdateChangeHandler}
                />
              </CCol>
              <CCol xs={10}>
                <CFormInput
                  value={currentId.judulBuku}
                  name="judulBuku"
                  id="inputJudulBuku"
                  label="Judul Buku"
                  placeholder="Judul Buku"
                  onChange={formUpdateChangeHandler}
                />
              </CCol>
              <CCol md={4}>
                <CDatePicker
                  date={currentId.tglPinjam}
                  name="tglPinjam"
                  footer
                  locale="id-ID"
                  id="tglPinjam"
                  label="Tanggal Pinjam"
                  onDateChange={(date) => {
                    formOnChangeDateHandler('tglPinjam', date)
                  }}
                />
              </CCol>
              <CCol md={4}>
                <CDatePicker
                  date={currentId.batasPinjam}
                  name="batasPinjam"
                  footer
                  locale="id-ID"
                  id="batasPinjam"
                  label="Batas Pinjam"
                  onDateChange={(date) => {
                    formOnChangeDateHandler('batasPinjam', date)
                  }}
                />
              </CCol>
              <CCol md={4}>
                <CDatePicker
                  date={currentId.tglKembali}
                  name="tglKembali"
                  footer
                  locale="id-ID"
                  id="tglKembali"
                  label="Tanggal Kembali"
                  onDateChange={(date) => {
                    formOnChangeDateHandler('tglKembali', date)
                  }}
                />
              </CCol>
              <CCol md={8}>
                <CFormSelect
                  value={currentId.status}
                  name="status"
                  id="inputStatus"
                  label="Status"
                  onChange={formUpdateChangeHandler}
                  text="* Pilih Status"
                >
                  <option>Belum Dikembalikan</option>
                  <option>Dikembalikan</option>
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormInput
                  value={currentId.denda}
                  name="denda"
                  id="inputDenda"
                  label="Denda"
                  onChange={formUpdateChangeHandler}
                />
              </CCol>
              <CModalFooter>
                <CButton type="submit"> Simpan </CButton>
                <CButton
                  color="light"
                  onClick={() => {
                    batalHandler()
                  }}
                >
                  {' '}
                  Kembali{' '}
                </CButton>
              </CModalFooter>
            </CForm>
          </CModalBody>
        </CModal>
      </>
    )
  } catch (e) {
    alert(e.message)
  }
}

export default AdminPeminjaman
