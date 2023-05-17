import { ListCategories, Books, NavbarComponent, } from "../../component";
import { Col, Row, Container } from "react-bootstrap";

import React, { Component } from "react";
import { API_URL } from "../../Utils/Constant";
import axios from "axios";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      books: [],
      categoryTerpilih : 'FISIKA'
    };
  }

  componentDidMount() {
    axios
      .get(API_URL + "products?category.nama"+this.state.categoryTerpilih)
      .then((response) => {
        const books = response.data;
        this.setState({ books });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  ChangeCategory =( value ) => {
    this.setState({
      categoryTerpilih : value,
      books : []
    })
    axios
      .get(API_URL + "products?category.nama"+value)
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
    const {categoryTerpilih} = this.state;
    return (
      <div className="App">
        <NavbarComponent />
        <div className="mt-3">
          <Container fluid>
              <Row>
                <ListCategories categoryTerpilih={this.categoryTerpilih} ChangeCategory={this.ChangeCategory}  />
                <Col className="mb-4">
                  <Row md={5} xs={6}  className="mt-5">{books && books.map((book) => (
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
