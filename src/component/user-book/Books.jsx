/* eslint-disable react-hooks/exhaustive-deps */
import React, { useImperativeHandle, useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useBookContext } from '../BookContext'

import './books.scss'

const Books = React.forwardRef((props, ref) => {
  const { books, searchResult, fetchData, searchBooks } = useBookContext()
  const [currentPage, setCurrentPage] = useState(1)
  const booksPerPage = 10

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (searchResult.length > 0) {
      setCurrentPage(1)
    } else {
      fetchData()
    }
  }, [searchResult])

  useImperativeHandle(ref, () => ({
    getSearch: (keyword) => {
      searchBooks(keyword)
    },
  }))

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks =
    searchResult.length > 0
      ? searchResult.slice(indexOfFirstBook, indexOfLastBook)
      : books.slice(indexOfFirstBook, indexOfLastBook)

  return (
    <Col className="ml-3 containerBook">
      <Row className="mb-4 katalog">
        {currentBooks.map((item) => (
          <Card className="shadow" key={item.kodeBuku}>
            <Card.Body>
              <Link to={`/Detail/${item.idBuku}`}>
                <Card.Img variant="top" src={`http://localhost:3005/${item.cover_buku}`} />
                <Card.Title>{item.judul}</Card.Title>
                <Card.Text>Tersedia: {item.tersedia}</Card.Text>
              </Link>
            </Card.Body>
          </Card>
        ))}
      </Row>
      {/* Pagination controls */}
      {searchResult.length === 0 && (
        <div className="pagination mb-4">
          <ul className="pagination">
            {Array.from({ length: Math.ceil(books.length / booksPerPage) }).map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Col>
  )
})

export default Books
