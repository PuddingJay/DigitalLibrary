import React, { useState, useEffect } from 'react'
import { Col } from 'react-bootstrap'
import axios from 'axios'
import ListGroup from 'react-bootstrap/ListGroup'

const ListCategories = () => {
  const [DaftarPustaka, setDaftarPustaka] = useState([])
  const [UniqueCategories, setUniqueCategories] = useState([])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3005/book')
      setDaftarPustaka(response.data.data)

      // Extract unique categories
      const categories = [...new Set(response.data.data.map((item) => item.Kategori))]
      setUniqueCategories(categories)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Col md={2} mt={-3}>
      <strong>
        <h4>Filter buku</h4>
      </strong>
      <hr />
      <ListGroup>
        {UniqueCategories.map((category) => (
          <ListGroup.Item key={category}>
            <h9>{category}</h9>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Col>
  )
}

export default ListCategories
