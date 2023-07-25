import { Books } from '../../../component'
import { Col, Container } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import React, { useState, useRef } from 'react'
import axios from 'axios'
import NavbarComponent from '../../../component/navbar/NavbarComponent'
import { CImage } from '@coreui/react'
import './home.scss'
import { BookProvider } from '../../../component/BookContext'
import { CFooter, CLink } from '@coreui/react-pro'
import { CgSearch } from 'react-icons/cg'

const Home = () => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const booksComponentRef = useRef(null)
  const [searchResult, setSearchResult] = useState([])
  const linkUper = 'https://universitaspertamina.ac.id/'

  const handleSearch = (event) => {
    setSearchKeyword(event.target.value)
  }

  const handleSearchSubmit = () => {
    if (booksComponentRef.current) {
      booksComponentRef.current.getSearch(searchKeyword)
    }
  }

  const getSearch = (keyword) => {
    axios
      .get(`https://api2.librarysmayuppentek.sch.id/book/search/${keyword}`)
      .then((response) => {
        setSearchResult(response.data.data)
      })
      .catch((error) => {
        console.error('Gagal melakukan pencarian:', error)
      })
  }

  return (
    <div className="App">
      <NavbarComponent style={{ position: 'sticky' }} />

      <Container fluid style={{ minHeight: '100vh' }}>
        <Col className="mb-2 ml-3">
          <div className="searchContainer">
            <div className="search">
              <CgSearch />
              <Form className="d-flex ml-2">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchKeyword}
                  onChange={handleSearch}
                />
                <Button onClick={handleSearchSubmit}>Search</Button>
              </Form>
            </div>
          </div>

          <div className="book-provider-container">
            <BookProvider>
              <Books
                ref={booksComponentRef}
                searchResult={searchResult}
                fetchData={() => getSearch(searchKeyword)}
              />
            </BookProvider>
          </div>
        </Col>
      </Container>
      <CFooter>
        <CImage href={linkUper} className="logo" rounded src="/images/logouper.png" />
        <div style={{ fontFamily: 'Poppins' }}>
          <span className="ms-1"> Copyright &copy; 2023 Pengabdian Kepada Masyarakat</span>
          <CLink href={linkUper}>Universitas Pertamina</CLink>
        </div>
      </CFooter>
    </div>
  )
}

export default Home
