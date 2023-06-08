// import './AdminDaftarPustaka.scss';
import React, { useState, useEffect, useRef } from "react";
import "../admin-dataAnggota/AdminDataAnggota.scss";
import "./AdminDaftarPustaka.scss";

import { CButton } from "@coreui/react";
import { PageHeader } from "../../../component/admin-page-heaader/PageHeader";
import axios from "axios";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";

const AdminDaftarPustaka = () => {
  const [DaftarPustaka, setDaftarPustaka] = useState([]);
  const [kode_buku, setKode_buku] = useState("");
  const [judul, setJudul] = useState("");
  const [penulis, setPenulis] = useState("");
  const [Kategori, setKategori] = useState("");
  const [tahun_terbit, setTahun_terbit] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [cover_buku, setCover_buku] = useState(null);
  const [file_ebook, setfile_ebook] = useState(null);
  const [modalTambah, setModalTambah] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [currentBookId, setCurrentBookId] = useState("");

  const formRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const toggleModalTambah = () => {
    setKode_buku('')
    setJudul('')
    setPenulis('')
    setKategori('')
    setTahun_terbit('')
    setKeterangan('')
    setJumlah('')
    setCover_buku('')
    setfile_ebook('')

    setModalTambah(!modalTambah);
  };

  const toggleModalUpdate = () => {
    setModalUpdate(!modalUpdate);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3005/BookRoute/book");
      setDaftarPustaka(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);
    cover_buku?.files && formData.append("cover_buku", cover_buku.files[0]);
    file_ebook?.files && formData.append("file_ebook", file_ebook.files[0]);
    console.log(formData);

    axios
      .post("http://localhost:3005/BookRoute/book", formData)
      .then(() => {
        toggleModalTambah();
        console.log(formData);
        fetchData();
        console.log(formData);
      })
      .catch((error) => {
        console.error(error);
      });
      console.log(formData);
  };

  const handleDelete = async (kode_buku) => {
    try {
      await axios.delete(`http://localhost:3005/BookRoute/book/${kode_buku}`);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData(formRef.current);
    
    cover_buku?.files && formData.append("cover_buku", cover_buku.files[0]);
    file_ebook?.files && formData.append("cover_buku", file_ebook.files[0]);
    console.log('after',formData)
    try {
      await axios.put(`http://localhost:3005/BookRoute/book/${currentBookId}`, formData);
      toggleModalUpdate();
      fetchData();

      // Perbarui data buku yang sudah dirubah dengan data baru
      setDaftarPustaka((prevData) => {
        return prevData.map((item) => {
          if (item.kode_buku === currentBookId) {
             return {
            ...item,
            kode_buku: kode_buku || item.kode_buku,
            judul: judul || item.judul,
            penulis: penulis || item.penulis,
            Kategori: Kategori || item.Kategori,
            tahun_terbit: tahun_terbit || item.tahun_terbit,
            keterangan: keterangan || item.keterangan,
            jumlah: jumlah || item.jumlah,
            cover_buku: cover_buku?.files[0]?.name || item.cover_buku,
            file_ebook: file_ebook?.files[0]?.name || item.file_ebook,
          };
          }
          console.log(item);
          return item;
        
        });
      });

      // Setel ulang nilai input menjadi kosong atau nilai default
      setKode_buku("");
      setJudul("");
      setPenulis("");
      setKategori("");
      setTahun_terbit("");
      setKeterangan("");
      setJumlah("");
      setCover_buku(null);
      setfile_ebook(null);
    } 
     catch (error) {
      console.error(error);
    }
  };

  const toggleModal = (kode_buku) => {
    const book = DaftarPustaka.find((item) => item.kode_buku === kode_buku);
    setCurrentBookId(book);
    setKode_buku(book.kode_buku);
    setJudul(book.judul);
    setPenulis(book.penulis);
    setKategori(book.Kategori);
    setTahun_terbit(book.tahun_terbit);
    setKeterangan(book.keterangan);
    setJumlah(book.jumlah);
    setCover_buku(null);
    setfile_ebook(null);
    setModalUpdate(!modalUpdate);
  };



  try {
    return (
      <>
        <PageHeader title="Daftar Pustaka" icon={<cilBook />} />
        <div className="cardLayout">
          <Button color="primary" onClick={toggleModalTambah}>
            Tambah Data
          </Button>

          <Modal isOpen={modalTambah} toggle={toggleModalTambah}>
            <ModalHeader toggle={toggleModalTambah}>Tambah Data</ModalHeader>
            <ModalBody>
              <Form innerRef={formRef} onSubmit={handleAdd}>
                <FormGroup>
                  <Label for="kode_buku">Kode Buku</Label>
                  <Input type="text" name="kode_buku" id="kode_buku" value={kode_buku} onChange={(e) => setKode_buku(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label for="judul">Judul</Label>
                  <Input type="text" name="judul" id="judul" value={judul} onChange={(e) => setJudul(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label for="penulis">Penulis</Label>
                  <Input type="text" name="penulis" id="penulis" value={penulis} onChange={(e) => setPenulis(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label for="penerbit">Kategori</Label>
                  <Input type="text" name="Kategori" id="Kategori" value={Kategori} onChange={(e) => setKategori(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label for="tahun_terbit">Tahun Terbit</Label>
                  <Input type="text" name="tahun_terbit" id="tahun_terbit" value={tahun_terbit} onChange={(e) => setTahun_terbit(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label for="Keterangan">Tipe file</Label>
                  <Input type="text" name="keterangan" id="keterangan" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label for="Jumlah">Jumlah</Label>
                  <Input type="text" name="jumlah" id="jumlah" value={jumlah} onChange={(e) => setJumlah(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label for="cover_buku">Cover Buku</Label>
                  <Input type="file" name="cover_buku" id="cover_buku" onChange={(e) => setCover_buku(e.target.files[0])} />
                </FormGroup>
                <FormGroup>
                  <Label for="file_ebook">File Buku digital</Label>
                  <Input type="file" name="file_ebook" id="file_ebook" onChange={(e) => setfile_ebook(e.target.files[0])} />
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
            <ModalHeader toggle={toggleModalUpdate}>Form {currentBookId ? "Edit" : "Edit"} Data</ModalHeader>
            <ModalBody>
              <Form innerRef={formRef}>
                <FormGroup>
                  <Label for="kode_buku">Kode Buku</Label>
                  <Input type="text" name="kode_buku" id="kode_buku" value={kode_buku} onChange={(e) => setKode_buku(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label for="judul">Judul</Label>
                  <Input type="text" name="judul" id="judul" value={judul} onChange={(e) => setJudul(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label for="penulis">Penulis</Label>
                  <Input type="text" name="penulis" id="penulis" value={penulis} onChange={(e) => setPenulis(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label for="penerbit">Penerbit</Label>
                  <Input type="text" name="penerbit" id="penerbit" value={Kategori} onChange={(e) => setKategori(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label for="tahun_terbit">Tahun Terbit</Label>
                  <Input type="text" name="tahun_terbit" id="tahun_terbit" value={tahun_terbit} onChange={(e) => setTahun_terbit(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label for="Keterangan">Tipe file</Label>
                  <Input type="text" name="keterangan" id="keterangan" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} />
                </FormGroup>
                <FormGroup>
                  <Label for="Jumlah">Jumlah</Label>
                  <Input type="text" name="jumlah" id="jumlah" value={jumlah} onChange={(e) => setJumlah(e.target.value)} />
                </FormGroup>

                <FormGroup>
                  <Label for="cover_buku">Cover Buku</Label>
                  <Input type="file" name="cover_buku" id="cover_buku" onChange={(e) => setCover_buku(e.target.files[0])} />
                </FormGroup>
                <FormGroup>
                  <Input type="hidden" name="cover_buku" id="cover_buku" onChange={(e) => setCover_buku(e.target.files[0])} />
                </FormGroup>
                <FormGroup>
                  <Label for="file_ebook">File Buku digital</Label>
                  <Input type="file" name="file_ebook" id="file_ebook" onChange={(e) => setfile_ebook(e.target.files[0])} />
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" color="primary" onClick={currentBookId ? () => handleUpdate(currentBookId) : handleAdd}>
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
                <th>No</th>
                <th>ID Buku</th>
                <th>Judul Buku</th>
                <th>Penulis</th>
                <th>Kategori</th>
                {/* <th>Tahun Terbit</th> */}
                <th>Tipe</th>
                <th>Jumlah Buku</th>
                <th>Cover buku</th>
                <th>File buku</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {DaftarPustaka.map((item, index) => (
                <tr key={item.kode_buku}>
                  <td>{index + 1}</td>
                  <td>{item.kode_buku}</td>
                  <td>{item.judul}</td>
                  <td>{item.penulis}</td>
                  <td>{item.Kategori}</td>
                  {/* <td>{item.tahun_terbit}</td> */}
                  <td>{item.keterangan}</td>
                  <td>{item.jumlah}</td>
                  <td>
                    <img className="photo"
                      src={`http://localhost:3005/${item.cover_buku}`}
                    ></img>
                  </td>
                  <td>{item.file_ebook}</td>
                  <td className="action">
                    <div className="buttonWrapper">
                      <CButton onClick={() => handleDelete(item.kode_buku)} color="danger">
                        Hapus
                      </CButton>
                      <CButton onClick={() => toggleModal(item.kode_buku)} color="dark">
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
    );
  } catch (e) {
    alert(e.message);
  }
};

export default AdminDaftarPustaka;
