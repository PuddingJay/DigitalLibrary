import React, { useState } from 'react';
import './AdminPeminjaman.scss'
import { nanoid } from 'nanoid'
import data from '../../../utils/mock-data-pinjam.json';
import { CButton, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { PageHeader } from './../../../component/admin-page-heaader/PageHeader';
import CIcon from '@coreui/icons-react'
import { cilSpreadsheet } from '@coreui/icons'


const AdminPeminjaman = () => {
  const [openModal, setOpenModal] = useState(false);
  const [members, setMembers] = useState(data);
  const [addFormData, setAddFormData] = useState({
    // Keterangsan: '',
    judulBuku: '',
    jumlahBuku: '',
    jumlahDipinjam: '',
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
      jumlahDipinjam: addFormData.jumlahDipinjam,
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
          title="Data Peminjaman"
          icon={<CIcon icon={cilSpreadsheet} size='xl' />}
        />
        <div className="cardLayout">
          <CButton
            color="primary"
            size="lg"
            className="btnModal"
            onClick={() => {
              setOpenModal(prev => !prev);
            }}>Tambah Data Pinjam</CButton>

          {openModal &&
            <div className="modalBg">
              <div className="modalWrapper">
                <div className="formTambahAnggota">
                  <form onSubmit={formOnSubmitHandler}>
                    <input type="text" name="judulBuku" required="required" placeholder="Judul" onChange={formOnChangeHandler} />
                    <input type="text" name="jumlahBuku" required="required" placeholder="Jumlah Buku" onChange={formOnChangeHandler} />
                    <input type="text" name="jumlahDipinjam" required="required" placeholder="Jumlah Dipinjam" onChange={formOnChangeHandler} />
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
                <th>Peminjam</th>
                <th>Judul Buku</th>
                <th>Tanggal Pinjam</th>
                <th>Tanggal Kembali</th>
                <th>Status</th>
                <th>Keterangan</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {currentPosts.map((member, index) => (
                <tr key={member.id}>
                  <td>{postPerPage * (currentPage - 1) + index + 1}</td>
                  <td>{member.idBuku}</td>
                  <td>{member.peminjam}</td>
                  <td>{member.judulBuku}</td>
                  <td>{member.tanggalPinjam}</td>
                  <td>{member.tanggalKembali}</td>
                  <td>{member.status}</td>
                  <td>{member.keterangan}</td>
                  <td className='action'>
                    {/* <div className="d-grid gap-2 d-md-block"> */}
                    <div className="buttonWrapper">
                      <CDropdown>
                        <CDropdownToggle color="primary">Status</CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem href="#">Kembali</CDropdownItem>
                          <CDropdownItem href="#">Denda</CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                      <CButton color="danger">Hapus</CButton>
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

export default AdminPeminjaman