import { ListCategories, Books, NavbarComponent, } from "../../../component";
import { Col, Row, Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import React, { Component } from "react";
import { API_URL } from "../../../utils/Constant";
import axios from "axios";
import NavBar from "../../../component/admin-nav-bar/NavBar";
import './home.scss';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      books: [],
      categoryTerpilih: 'FISIKA'
    };
  }

  componentDidMount() {
    axios
      .get(API_URL + "products?category.nama" + this.state.categoryTerpilih)
      .then((response) => {
        const books = response.data;
        this.setState({ books });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  ChangeCategory = (value) => {
    this.setState({
      categoryTerpilih: value,
      books: []
    })
    axios
      .get(API_URL + "products?category.nama" + value)
      .then((response) => {
        const books = response.data;
        this.setState({ books });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { books } = this.state;
    const { categoryTerpilih } = this.state;
    return (
      <div className="App">
        <NavbarComponent />
        <NavBar>
        </NavBar>
        <Form className="d-flex ml-2">
          <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" />
          <Button variant="success">Search</Button>
        </Form>
        <div className="mt-3">
          <Container fluid>
            <Row>
              <ListCategories categoryTerpilih={this.categoryTerpilih} ChangeCategory={this.ChangeCategory} />
              <Col className="mb-2">
                <Row className="mt-5">
                  {books && books.map((book) => (
                    <Books
                      key={book.id}
                      book={book}
                    />))}
                </Row>
              </Col>
            </Row>
          </Container>
        </div>

      </div>

    );
  }
}
