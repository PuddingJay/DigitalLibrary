import { ListCategories, Books } from '../../../component'
import { Col, Row, Container } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import React, { useState, useRef } from 'react'
import { API_URL } from '../../../utils/Constant'
import axios from 'axios'
import NavbarComponent from '../../../component/NavbarComponent'
import { CImage } from '@coreui/react'

import './home.scss'
import { BookProvider } from '../../../component/BookContext'

const Home = () => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const booksComponentRef = useRef(null)
  const [searchResult, setSearchResult] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

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
      .get(`${API_URL}/book/search/${keyword}`)
      .then((response) => {
        setSearchResult(response.data.data)
      })
      .catch((error) => {
        console.error('Gagal melakukan pencarian:', error)
      })
  }

  return (
    <div className="App">
      <NavbarComponent />
      {/* <div className="mt-3"> */}
      <Container fluid>
        <Row className="mb-3">
          <Col className="mb-2 ml-3">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Form className="d-flex ml-2">
                <input
                  type="text"
                  placeholder="Cari buku..."
                  value={searchKeyword}
                  onChange={handleSearch}
                />
                <Button onClick={handleSearchSubmit} variant="success">
                  Search
                </Button>
              </Form>
            </div>

            <div className="book-provider-container" style={{ marginBottom: '20px' }}>
              <BookProvider>
                {/* Komponen-komponen lain */}
                <Books
                  ref={booksComponentRef}
                  searchResult={searchResult}
                  fetchData={() => getSearch(searchKeyword)}
                />
              </BookProvider>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="logo">
        <CImage rounded src="/images/logouper.png" width={200} height={150} />
      </div>
      {/* </div> */}
    </div>
  )
}

export default Home

// Home.js

// import React, { useEffect } from "react";
// import { Col, Row, Container } from "react-bootstrap";
// import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
// import { useBookContext } from "../../../component/BookContext";
// import { ListCategories } from "../../../component";
// import Books from "../../../component/user-book/Books"
// import NavbarComponent from "../../../component/NavbarComponent";
// import "./home.scss";

// const Home = () => {
//   const { searchKeyword, searchBooks } = useBookContext();

//   const handleChange = (event) => {
//     searchBooks(event.target.value);
//   };

//   useEffect(() => {
//     searchBooks("");
//   }, []);

//   return (
//     <div className="App">
//       <NavbarComponent />
//       <div className="mt-3">
//         <Container fluid>
//           <Row className="mb-3">
//             <ListCategories />
//             <Col className="mb-2 ml-3">
//               <Form className="d-flex ml-2">
//                 <input
//                   type="text"
//                   placeholder="Cari buku..."
//                   value={searchKeyword}
//                   onChange={handleChange}
//                 />
//                 <Button variant="success">Search</Button>
//               </Form>
//               <Books />
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </div>
//   );
// };

// export default Home;
