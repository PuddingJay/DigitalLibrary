import { Books } from '../../../component'
import { Col, Container } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import React, { useState, useRef, Suspense } from 'react'
import axios from 'axios'
import NavbarComponent from '../../../component/navbar/NavbarComponent'
import { CImage, CSpinner } from '@coreui/react'
import './home.scss'
import { BookProvider } from '../../../component/BookContext'
import { CFooter, CLink } from '@coreui/react-pro'
import { CgSearch } from 'react-icons/cg'
import FeedbackForm from 'src/component/FeedBackForm'
import TopBooks from 'src/component/user-book/TopBooks'

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
      .get(`http://localhost:3005/book/search/${keyword}`)
      .then((response) => {
        setSearchResult(response.data.data)
      })
      .catch((error) => {
        console.error('Gagal melakukan pencarian:', error)
      })
  }

  return (
    <Suspense fallback={<CSpinner color="primary" />}>
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
            <div className="center-container">
              <div className="top-books-container">
                <h2 className="ml-4">Top Rates Books</h2>
                <TopBooks />
              </div>
              <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '18px' }}>
                Mari bangun dan dukung lebih maju SMA Yuppentek 1 kita tercinta dengan memberikan
                feedback dan saran buku supaya sistem e-library ini berkembang lebih baik.
              </p>
              <FeedbackForm />
            </div>
          </Col>
        </Container>
        <CFooter>
          <CImage href={linkUper} className="logo" rounded src="/images/logouper.png" />
          <div style={{ fontFamily: 'Poppins' }}>
            <span className="ms-1"> Copyright &copy; 2023 Pengabdian Kepada Masyarakat</span>
            <CLink href={linkUper} target="_blank" rel="noreferrer">
              Universitas Pertamina
            </CLink>
          </div>
        </CFooter>
      </div>
    </Suspense>
  )
}

export default Home
