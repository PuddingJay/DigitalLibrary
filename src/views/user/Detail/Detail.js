/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import NavbarComponent from '../../../component/NavbarComponent'
import { Col, Row, Container } from 'react-bootstrap'

import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const DetailBuku = ({ match }) => {
  const [catalogItem, setCatalogItem] = useState(null)
  const { kode_buku } = useParams()

  useEffect(() => {
    const fetchCatalogItem = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3005/BookRoute/book/${match.params.kode_buku}`,
        )
        console.log(response)
        setCatalogItem(response.data)
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
                    src={catalogItem.cover_buku}
                    alt={catalogItem.judul}
                    style={{ width: '20rem', height: '25rem' }}
                  />
                  <Row md={1}>
                    <br></br>
                    <br></br>
                    <button variant="primary" style={{ width: '18rem', height: '2rem' }}>
                      Baca
                    </button>
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
                <button style={{ width: '6rem', height: '2rem' }}>{catalogItem.keterangan}</button>
                <br></br>
                <br></br>
                <button style={{ width: '9rem', height: '2rem' }}>{catalogItem.Kategori}</button>
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
