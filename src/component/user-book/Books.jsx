import React from "react";
import Card from "react-bootstrap/Card";
import { Col, Row } from "react-bootstrap";
import "../../index.css";
import { Link } from "react-router-dom";
import './books.scss'

const Books = ({ book }) => {
  return (
    <Col>
      <Row className="mb-4">
        <Card className="shadow">
          <Link to='/Detail'>
            <Card.Img variant="top" src={"assets/images/" + book.category.nama + "/" + book.gambar} />
            <Card.Body>
              <Card.Title>
                {book.nama}
              </Card.Title>
              <Card.Text>
                Tersedia : {book.jumlah}
              </Card.Text>
              {/* <Button className='toDetail' onClick={() => navigate("/Detail")} variant="primary">
              Detail Buku
            </Button> */}
            </Card.Body>
          </Link>
        </Card>
      </Row>
    </Col>
  );
};

export default Books;
