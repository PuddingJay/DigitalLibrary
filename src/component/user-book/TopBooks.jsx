/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'

import './books.scss'

const TopBooks = () => {
  const [DaftarPustaka, setDaftarPustaka] = useState([])

  useEffect(() => {
    fetchData()
    console.log(DaftarPustaka)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3005/topBooks')
      setDaftarPustaka(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Col className="ml-3 containerBook">
      <Row className="mb-4 katalog">
        {DaftarPustaka.map((item) => (
          <Card className="shadow" key={item.idBuku}>
            <Card.Body>
              <Link to={`/Detail/${item.idBuku}`}>
                <Card.Img variant="top" src={`http://localhost:3005/${item.cover_buku}`} />
                <Card.Title>{item.judul}</Card.Title>
                <Card.Text>Tersedia: {item.jumlah}</Card.Text>
              </Link>
            </Card.Body>
          </Card>
        ))}
      </Row>
    </Col>
  )
}

export default TopBooks
