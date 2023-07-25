import NavbarComponent from '../../../component/navbar/NavbarComponent'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './Detail.scss'

// import { Link, useHistory } from "react-router-dom";
import { CButton, CCard, CCardBody } from '@coreui/react-pro'

const DetailBuku = () => {
  const [catalogItem, setCatalogItem] = useState(null)
  const params = useParams()

  useEffect(() => {
    const fetchCatalogItem = async () => {
      try {
        const url = `https://api2.librarysmayuppentek.sch.id/book/${params.id}`
        const response = await axios.get(url)
        setCatalogItem(response.data.data[0])
      } catch (error) {
        console.error(error)
      }
    }
    fetchCatalogItem()
  }, [params.id])
  console.log(catalogItem)
  if (!catalogItem) {
    return <div>Loading...</div>
  }

  return (
    <div className="App">
      <NavbarComponent />
      <div className="bookDetailContainer">
        <div className="bookPosterAction">
          <img
            src={`https://api2.librarysmayuppentek.sch.id/${catalogItem.cover_buku}`}
            alt={catalogItem.judul}
            className="bookPoster"
          />
          {catalogItem.keterangan === 'Buku Fisik' ? (
            <CButton colors="primary" disabled className="disabledButton">
              Baca
            </CButton>
          ) : (
            <Link to={`/PdfRead/${catalogItem.idBuku}`}>
              <CButton colors="primary">Baca</CButton>
            </Link>
          )}
        </div>
        <div className="bookInfo">
          <h2 className="bookTitle">{catalogItem.judul}</h2>
          <div className="bookLabel">
            <CCard>
              <CCardBody> {catalogItem.Kategori}</CCardBody>
            </CCard>
            <CCard>
              <CCardBody> {catalogItem.keterangan}</CCardBody>
            </CCard>
          </div>
          <div className="bookCreated">
            <h3>Information</h3>
            <h4>Pengarang</h4>
            <p>Penulis : {catalogItem.penulis}</p>
            <h4>Tahun Terbit</h4>
            <p>Tahun Terbit : {catalogItem.tahun_terbit}</p>
            <h4>Tersedia</h4>
            <p>Tersedia : {catalogItem.jumlah}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailBuku
