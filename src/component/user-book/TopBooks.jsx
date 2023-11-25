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
      const response = await axios.get('https://api2.librarysmayuppentek.sch.id/topBooks')
      setDaftarPustaka(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Col className="ml-3 containerBook">
      <Row className="mb-4 katalog">
        {DaftarPustaka.map((item) => (
          <Card className="shadow" key={item.kodeBuku}>
            <Card.Body>
              <Link to={`/Detail/${item.kodeBuku}`}>
                <Card.Img variant="top" src={`https://api2.librarysmayuppentek.sch.id/${item.cover}`} />
                <Card.Title>{item.judul}</Card.Title>
                <Card.Text>Tersedia: {item.tersedia}</Card.Text>
              </Link>
            </Card.Body>
          </Card>
        ))}
      </Row>
    </Col>
  )
}

export default TopBooks
