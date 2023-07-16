import NavbarComponent from '../../../component/NavbarComponent'
import { Col, Row, Container } from 'react-bootstrap'

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Link } from 'react-router-dom'

// import { Link, useHistory } from "react-router-dom";

const DetailBuku = () => {
  const [catalogItem, setCatalogItem] = useState(null)
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCatalogItem = async () => {
      try {
        console.log(params)
        const url = `http://localhost:3005/book/${params.id}`
        console.log(url)
        const response = await axios.get(url)
        console.log('response', response)
        setCatalogItem(response.data.data[0])
      } catch (error) {
        console.error(error)
      }
    }

    fetchCatalogItem()
  }, [])
  console.log(catalogItem)
  if (!catalogItem) {
    return <div>Loading...</div>
  }

  const handleBacaBuku = () => {
    navigate(`/PDF/${catalogItem.idBuku}`)
  }

  return (
    <div className="App">
      <NavbarComponent />
      <div className="mt-3">
        <Container fluid>
          <Row>
            <Col md={2} mt="-2"></Col>
            <Col className="mb-8">
              <Row>
                <div className="product">
                  <img
                    src={`http://localhost:3005/${catalogItem.cover_buku}`}
                    alt={catalogItem.judul}
                    style={{ width: '20rem', height: '25rem' }}
                  />
                  <Row md={1}>
                    <br></br>
                    <br></br>

                    <Link to={`/PdfRead/${catalogItem.idBuku}`}>
                      <button style={{ width: '18rem', height: '2rem' }}>Baca</button>
                    </Link>
                  </Row>
                </div>
              </Row>
            </Col>
            <Col>
              <h2>
                <strong>{catalogItem.judul}</strong>
              </h2>
              <p>Penulis : {catalogItem.penulis}</p>
              <p>Tahun Terbit : {catalogItem.tahun_terbit}</p>
              <Row md={2}>
                <button style={{ width: '15rem', height: '2rem' }}>{catalogItem.keterangan}</button>
                <br></br>
                <br></br>
                <button style={{ width: '15rem', height: '2rem' }}>{catalogItem.Kategori}</button>
              </Row>
              <hr />

              <p>
                {' '}
                <strong>Tersedia : {catalogItem.jumlah}</strong>{' '}
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default DetailBuku
