import React, { useState, useEffect } from 'react'
import { Col } from 'react-bootstrap'
import axios from 'axios'
import ListGroup from 'react-bootstrap/ListGroup'

const ListCategories = () => {
  const [DaftarPustaka, setDaftarPustaka] = useState([])

  useEffect(() => {
    fetchData()
    console.log(DaftarPustaka)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('https://api2.librarysmayuppentek.sch.id/book')
      setDaftarPustaka(response.data.data)
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
        {DaftarPustaka.map((item) => (
          <ListGroup.Item key={item.kode_buku}>
            {/* onClick={() => ChangeCategory(item.Kategori)} className={categoryTerpilih === item.Kategori && "category-aktif"} style={{ cursor: "pointer" }} */}
            <h9>{item.Kategori}</h9>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Col>
  )
}

export default ListCategories
