import React, { useState } from "react";
import { nanoid } from "nanoid";
import "./AdminDataAnggota.scss";
import data from "../../../Utils/mock-data-anggota.json";

const AdminDataAnggota = () => {
  const [members, setMembers] = useState(data);
  const [addFormData, setAddFormData] = useState({
    NIS: "",
    fullName: "",
    Kelas: "",
    Jurusan: "",
  });

  const formOnChangeHandler = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  };

  const formOnSubmitHandler = (event) => {
    event.preventDefault();

    const newMember = {
      id: nanoid(),
      NIS: addFormData.NIS,
      fullName: addFormData.fullName,
      Kelas: addFormData.Kelas,
      Jurusan: addFormData.Jurusan,
    };

    const newMembers = [...members, newMember];
    setMembers(newMembers);
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>NIS</th>
            <th>Nama</th>
            <th>Kelas</th>
            <th>Jurusan</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr>
              <td>{member.NIS}</td>
              <td>{member.fullName}</td>
              <td>{member.Kelas}</td>
              <td>{member.Jurusan}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2> Tambah Anggota </h2>
      <form onSubmit={formOnSubmitHandler}>
        <input type="text" name="NIS" required="required" placeholder="Masukkan NIS siswa" onChange={formOnChangeHandler} />
        <input type="text" name="fullName" required="required" placeholder="Masukkan nama" onChange={formOnChangeHandler} />
        <input type="text" name="Kelas" required="required" placeholder="Masukkan kelas" onChange={formOnChangeHandler} />
        <input type="text" name="Jurusan" required="required" placeholder="Masukkan jurusan" onChange={formOnChangeHandler} />
        <button type="submit"> Tambah </button>
      </form>
    </>
  );
};

export default AdminDataAnggota;
