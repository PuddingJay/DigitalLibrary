/* eslint-disable prettier/prettier */
import React, { useImperativeHandle, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useBookContext } from '../BookContext'

import './books.scss'

const Books = React.forwardRef((props, ref) => {
  const { books, searchResult, fetchData, searchBooks } = useBookContext()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (searchResult.length > 0) {
    } else {
      fetchData()
    }
  }, [searchResult])

  useImperativeHandle(ref, () => ({
    getSearch: (keyword) => {
      searchBooks(keyword)
    },
  }))

  return (
    <Col className="ml-3 containerBook">
      <Row className="mb-4 katalog">
        {searchResult.length > 0
          ? searchResult.map((item) => (
            <Card className="shadow" key={item.idBuku}>
              <Card.Body>
                <Link to={`/Detail/${item.idBuku}`}>
                  <Card.Img variant="top" src={`http://localhost:3005/${item.cover_buku}`} />
                  <Card.Title>{item.judul}</Card.Title>
                  <Card.Text>Tersedia: {item.jumlah}</Card.Text>
                </Link>
              </Card.Body>
            </Card>
          ))
          : books.map((item) => (
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
})

export default Books
