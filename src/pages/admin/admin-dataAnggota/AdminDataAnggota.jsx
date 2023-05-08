import React, { useState } from 'react'
import { nanoid } from 'nanoid'
import './AdminDataAnggota.scss';
import data from '../../../utils/mock-data-anggota.json';

const AdminDataAnggota = () => {
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
  const currentPosts = data.slice(indexOfFirstPage, indexOfLastPage);

  const showPagination = () => {
    const pageNumbers = [];
    const totalPosts = data.length;

    for (let i = 1; i <= Math.ceil(totalPosts / postPerPage); i++) {
      pageNumbers.push(i);
    }
    console.log(pageNumbers);

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
        <h2> Tambah Anggota </h2>
        <form onSubmit={formOnSubmitHandler}>
          <input type="text" name="NIS" required="required" placeholder="NIS" onChange={formOnChangeHandler} />
          <input type="text" name="fullName" required="required" placeholder="Nama" onChange={formOnChangeHandler} />
          <input type="text" name="Kelas" required="required" placeholder="Kelas" onChange={formOnChangeHandler} />
          <input type="text" name="Jurusan" required="required" placeholder="Jurusan" onChange={formOnChangeHandler} />
          <button type="submit"> Tambah </button>
        </form>

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
      </>
    )
  } catch (e) {
    alert(e.message);
  }

}

export default AdminDataAnggota