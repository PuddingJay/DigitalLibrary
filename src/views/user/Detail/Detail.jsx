// import NavbarComponent from "../../../component/NavbarComponent";
// import { Col, Row, Container } from "react-bootstrap";
import React, { Component } from 'react'
import NavBar from '../../../component/admin-nav-bar/NavBar'
import './Detail.scss'
import { CButton, CCard, CCardBody } from '@coreui/react'

export default class Home extends Component {
  render() {
    const product = {
      name: 'Bhinneka Tunggal Ika, Buku Ajar Untuk SMA',
      pengarang: 'Ajie Saka Mana',
      tahunTerbit: '2018',
      jenisBuku: 'E-book',
      kategori: 'PKn',
      image: 'https://loremflickr.com/500/400/book,cover',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec augue elementum, varius justo ac, congue ante. Praesent malesuada iaculis mauris et varius. Sed faucibus dui non leo porttitor, sed faucibus mauris iaculis. Donec et purus rutrum, venenatis neque at, pellentesque lacus. Nam dolor diam, sollicitudin nec tempor at, eleifend sit amet lorem. Etiam imperdiet laoreet suscipit',
      tersedia: '20',
    }

    console.log(product.name)

    return (
      <>
        <NavBar />
        <div className="bookDetailContainer">
          <div className="bookPosterAction">
            <img className="bookPoster" src={product.image} alt="Gambar Sepatu" />
            <CButton colors="primary">Baca</CButton>
          </div>
          <div className="bookInfo">
            <h2 className="bookTitle">{product.name}</h2>
            <div className="bookLabel">
              <CCard>
                <CCardBody>{product.jenisBuku}</CCardBody>
              </CCard>
              <CCard>
                <CCardBody>{product.kategori}</CCardBody>
              </CCard>
            </div>
            <div className="bookCreated">
              <h3>Information</h3>
              <h4>Pengarang</h4>
              <p>{product.pengarang}</p>
              <h4>Tahun Terbit</h4>
              <p>{product.tahunTerbit}</p>
            </div>
            <div className="bookDescription">
              <h3>Ringkasan Buku</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
        {/* <div className="mt-3">
          <Container fluid>
            <Row>
              <Col md={2} mt="-2" />
              <Col className="mb-8">
                <Row>
                  <div className="product">
                    <img src={product.image} alt={product.name} style={{ width: "20rem", height: "25rem" }} />
                    <Row md={1}>
                      <br></br>
                      <br></br>
                      <button variant="primary" style={{ width: "18rem", height: "2rem" }}>
                        Baca
                      </button>
                    </Row>
                  </div>
                </Row>
              </Col>
              <Col>
                <h2>
                  <strong>{product.name}</strong>
                </h2>
                <p>Penulis : {product.pengarang}</p>
                <p>Tahun Terbit : {product.tahunTerbit}</p>
                <Row md={2}>
                  <button style={{ width: "6rem", height: "2rem" }}>{product.jenisBuku}</button>
                  <br></br>
                  <br></br>
                  <button style={{ width: "9rem", height: "2rem" }}>{product.kategori}</button>
                </Row>
                <hr />
                <h3>
                  <strong>Ringkasan Buku</strong>
                </h3>
                <p>{product.description}</p>
                <p>
                  {" "}
                  <strong>tersedia : {product.tersedia}</strong>{" "}
                </p>
              </Col>
            </Row>
          </Container>
        </div> */}
      </>
    )
  }
}
