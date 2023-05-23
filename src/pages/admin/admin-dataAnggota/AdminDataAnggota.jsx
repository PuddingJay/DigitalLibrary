import React, { useState } from 'react'
import { nanoid } from 'nanoid'
import data from '../../../utils/mock-data-anggota.json';
import { CButton } from '@coreui/react'
import './AdminDataAnggota.scss';
import { PageHeader } from './../../../component/admin-page-heaader/PageHeader';
import CIcon from '@coreui/icons-react'
import { cilPeople } from '@coreui/icons'

const AdminDataAnggota = () => {
  const [openModal, setOpenModal] = useState(false);
  const [members, setMembers] = useState(data);
  const [addFormData, setAddFormData] = useState({
    NIS: '',
    fullName: '',
    Kelas: '',
    Jurusan: '',
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
      NIS: addFormData.NIS,
      fullName: addFormData.fullName,
      Kelas: addFormData.Kelas,
      Jurusan: addFormData.Jurusan,
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
          title="Data Anggota"
          icon={<CIcon icon={cilPeople} size='xl' />}
        />
        <div className="cardLayout">
          <CButton
            color="primary"
            size="lg"
            className="btnModal"
            onClick={() => {
              setOpenModal(prev => !prev);
            }}>Tambah Anggota</CButton>

          {openModal &&
            <div className="modalBg">
              <div className="modalWrapper">
                <div className="formTambahAnggota">
                  <form onSubmit={formOnSubmitHandler}>
                    <input type="text" name="NIS" required="required" placeholder="NIS" onChange={formOnChangeHandler} />
                    <input type="text" name="fullName" required="required" placeholder="Nama" onChange={formOnChangeHandler} />
                    <input type="text" name="Kelas" required="required" placeholder="Kelas" onChange={formOnChangeHandler} />
                    <input type="text" name="Jurusan" required="required" placeholder="Jurusan" onChange={formOnChangeHandler} />
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
                <th>S/N</th>
                <th>NIS</th>
                <th>Nama</th>
                <th>Kelas</th>
                <th>Jurusan</th>
              </tr>
            </thead>

            <tbody>
              {currentPosts.map((member, index) => (
                <tr key={member.id}>
                  <td>{postPerPage * (currentPage - 1) + index + 1}</td>
                  <td>{member.NIS}</td>
                  <td>{member.fullName}</td>
                  <td>{member.Kelas}</td>
                  <td>{member.Jurusan}</td>
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

export default AdminDataAnggota