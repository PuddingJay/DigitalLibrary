import NavbarComponent from "../../component/NavbarComponent";
import { Col, Row, Container } from "react-bootstrap";

import React, { Component } from "react";

export default class Home extends Component {
  render() {
    const product = {
      name: "Bhinneka Tunggal Ika, Buku Ajar Untuk SMA",
      pengarang: "Ajie Saka Mana",
      Tahun_Terbit: "2018",
      Jenis_buku: "E-book",
      Kategori: "PKn",
      image: "https://cf.shopee.co.id/file/sg-11134201-22100-dyky52bk44iv37_tn",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec augue elementum, varius justo ac, congue ante. Praesent malesuada iaculis mauris et varius. Sed faucibus dui non leo porttitor, sed faucibus mauris iaculis. Donec et purus rutrum, venenatis neque at, pellentesque lacus. Nam dolor diam, sollicitudin nec tempor at, eleifend sit amet lorem. Etiam imperdiet laoreet suscipit",
      Tersedia: "20",
    };

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
                <p>Tahun Terbit : {product.Tahun_Terbit}</p>
                <Row md={2}>
                  <button style={{ width: "6rem", height: "2rem" }}>{product.Jenis_buku}</button>
                  <br></br>
                  <br></br>
                  <button style={{ width: "9rem", height: "2rem" }}>{product.Kategori}</button>
                </Row>
                <hr />
                <h3>
                  <strong>Ringkasan Buku</strong>
                </h3>
                <p>{product.description}</p>
                <p>
                  {" "}
                  <strong>Tersedia : {product.Tersedia}</strong>{" "}
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}
