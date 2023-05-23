// import './AdminDaftarPustaka.scss';
import React, { useState } from 'react';
import '../admin-dataAnggota/AdminDataAnggota.scss';
import './AdminDaftarPustaka.scss';
import { nanoid } from 'nanoid'
import data from '../../../utils/mock-data-dapus.json';
import { CButton } from '@coreui/react'
import { PageHeader } from './../../../component/admin-page-heaader/PageHeader';
import CIcon from '@coreui/icons-react'
import { cilBook } from '@coreui/icons'

const AdminDaftarPustaka = () => {
  const [openModal, setOpenModal] = useState(false);
  const [members, setMembers] = useState(data);
  const [addFormData, setAddFormData] = useState({
    // Jurusan: '',
    judulBuku: '',
    jumlahBuku: '',
    keterangan: '',
  });
  const [postPerPage] = useState(5);
  const [currentPage, setcurrentPage] = useState(1);


  const formOnChangeHandler = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute('name');
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  }

  const formOnSubmitHandler = (event) => {
    event.preventDefault();

    const newMember = {
      id: nanoid(),
      idBuku: addFormData.idBuku,
      judulBuku: addFormData.judulBuku,
      jumlahBuku: addFormData.jumlahBuku,
      keterangan: addFormData.keterangan,
    }

    const newMembers = [...members, newMember];
    setMembers(newMembers);
  }

  const indexOfLastPage = currentPage * postPerPage;
  const indexOfFirstPage = indexOfLastPage - postPerPage;
  const currentPosts = members.slice(indexOfFirstPage, indexOfLastPage);

  const showPagination = () => {
    const pageNumbers = [];
    const totalPosts = members.length;

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
          title="Daftar Pustaka"
          icon={<CIcon icon={cilBook} size='xl' />}
        />
        <div className="cardLayout">
          <CButton
            color="primary"
            size="lg"
            className="btnModal"
            onClick={() => {
              setOpenModal(prev => !prev);
            }}>Tambah Buku</CButton>

          {openModal &&
            <div className="modalBg">
              <div className="modalWrapper">
                <div className="formTambahAnggota">
                  <form onSubmit={formOnSubmitHandler}>
                    <input type="text" name="judulBuku" required="required" placeholder="Judul" onChange={formOnChangeHandler} />
                    <input type="text" name="jumlahBuku" required="required" placeholder="Jumlah Buku" onChange={formOnChangeHandler} />
                    <input type="text" name="keterangan" required="required" placeholder="Jumlah Dipinjam" onChange={formOnChangeHandler} />
                    {/* <input type="text" name="Jurusan" required="required" placeholder="Jurusan" onChange={formOnChangeHandler} /> */}
                    <div className="btnActionModal">
                      <button type="submit"> Tambah </button>
                      <button
                        onClick={() => {
                          setOpenModal(false)
                        }}> Kembali </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>}
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>ID Buku</th>
                <th>Judul Buku</th>
                <th>Jumlah Buku</th>
                <th>Keterangan</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {currentPosts.map((member, index) => (
                <tr key={member.id}>
                  <td>{postPerPage * (currentPage - 1) + index + 1}</td>
                  <td>{member.idBuku}</td>
                  <td>{member.judulBuku}</td>
                  <td>{member.jumlahBuku}</td>
                  <td>{member.keterangan}</td>
                  <td className='action'>
                    {/* <div className="d-grid gap-2 d-md-block"> */}
                    <div className="buttonWrapper">

                      <CButton color="primary">Detail</CButton>
                      <CButton color="danger">Hapus</CButton>
                      <CButton color="dark">Edit</CButton>
                      <CButton color="warning">Cetak</CButton>
                    </div>
                    {/* </div> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='pagination'>
            {showPagination()}
          </div>
        </div>
      </>
    )
  } catch (e) {
    alert(e.message);
  }
}

export default AdminDaftarPustaka;
