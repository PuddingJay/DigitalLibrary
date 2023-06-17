import { ListCategories, Books } from '../../../component'
import { Col, Row, Container } from 'react-bootstrap'
import React, { Component } from 'react'
import { API_URL } from '../../../utils/Constant'
import axios from 'axios'
// import NavBar from "../../../component/admin-nav-bar/NavBar";
import NavbarComponent from '../../../component/NavbarComponent'
import './home.scss'

export default class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      books: [],
      categoryTerpilih: 'FISIKA',
    }
  }

  componentDidMount() {
    axios
      .get(API_URL + 'products?category.nama' + this.state.categoryTerpilih)
      .then((response) => {
        const books = response.data
        this.setState({ books })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  ChangeCategory = (value) => {
    this.setState({
      categoryTerpilih: value,
      books: [],
    })
    axios
      .get(API_URL + 'products?category.nama' + value)
      .then((response) => {
        const books = response.data
        this.setState({ books })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    // const { categoryTerpilih } = this.state;
    return (
      <div className="App">
        <NavbarComponent />
        {/* <NavBar></NavBar> */}
        <div className="mt-3">
          <Container fluid>
            <Row className="mb-3">
              <ListCategories
                categoryTerpilih={this.categoryTerpilih}
                ChangeCategory={this.ChangeCategory}
              />
              <Col className="mb-2 ml-3">
                <Books />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    )
  }
}
