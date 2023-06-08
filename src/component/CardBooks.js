import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Col, Row } from "react-bootstrap";
import "../index.css";
import { useNavigate } from "react-router-dom";

const CardBooks = ({ book }) => {
  const navigate = useNavigate();
  return (
    <div>
      <Col>
        <Row className="mb-4">
          <Card style={{ width: "13rem", height: "17rem" }} className="shadow">
            <Card.Img variant="top" src={"assets/images/" + book.category.nama + "/" + book.gambar} style={{ width: "12rem", height: "7rem" }} />
            <Card.Body>
              <Card.Title>
                <h6>{book.nama}</h6>
              </Card.Title>
              <Card.Text>
                <h8>Tersedia : {book.jumlah}</h8>
              </Card.Text>
              <Button onClick={() => navigate("/Detail")} variant="primary">
                Detail Buku
              </Button>
            </Card.Body>
          </Card>
        </Row>
      </Col>
    </div>
  );
};

export default CardBooks;
