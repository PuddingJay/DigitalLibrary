import React, { useState, useEffect, } from "react";
import Card from "react-bootstrap/Card";
import { Col, Row } from "react-bootstrap";
import "../../index.css";
import { Link } from "react-router-dom";
import "./books.scss";
import axios from "axios";
import NavbarComponent from "../NavbarComponent";

const Books = () => {
  const [DaftarPustaka, setDaftarPustaka] = useState([]);

  const getSearch = (keyword) => {
    axios
      .get(`http://localhost:3005/BookRoute/book?search=${keyword}`)
      .then((response) => {
        setDaftarPustaka(response.data.data);
      })
      .catch((error) => {
        console.error('Gagal melakukan pencarian:', error);
      });
  };


  useEffect(() => {
    fetchData();
    console.log(DaftarPustaka)
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3005/BookRoute/book");
      setDaftarPustaka(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Col className= "ml-3">
      <Row className="mb-4">
        {DaftarPustaka.map((item) => (
          // <Card className="shadow">
          //   <Link to={`/Detail/${item.kode_buku}`} key={item.kode_buku}>
          //     <Card.Img variant="top" src={`http://localhost:3005/${item.cover_buku}`} />
          //     <Card.Body>
          //       <Card.Title>{item.judul}</Card.Title>
          //       <Card.Text>Tersedia : {item.jumlah}</Card.Text>
          //       {/* <Button className='toDetail' onClick={() => navigate("/Detail")} variant="primary">
          //               Detail Buku
          //               </Button> */}
          //     </Card.Body>
          //   </Link>
          // </Card>
          <Card className="shadow" key={item.kode_buku}>
          <Card.Body>
            <Link to={`/Detail/${item.kode_buku}`}>
              <Card.Img variant="top" src={`http://localhost:3005/${item.cover_buku}`} />
            </Link>
            <Card.Title>{item.judul}</Card.Title>
            <Card.Text>Tersedia: {item.jumlah}</Card.Text>
            {/* <Button className='toDetail' onClick={() => navigate("/Detail")} variant="primary">
              Detail Buku
            </Button> */}
          </Card.Body>
        </Card>
        ))}
      </Row>
    </Col>
  );
};

export default Books;
