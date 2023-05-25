import React, { Component } from "react";
import { Col } from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../utils/Constant";
import ListGroup from 'react-bootstrap/ListGroup';

export default class ListCategories extends Component {
  constructor(props) {
    super(props)

    this.state = {
      catogories: []
    }
  }
  componentDidMount() {
    axios
      .get(API_URL + "categories")
      .then((response) => {
        const categories = response.data;
        this.setState({ categories });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { categories } = this.state;
    const { ChangeCategory, categoryTerpilih } = this.props;
    return (
      <Col md={2} mt={-3}>
        <strong>
          <h4>Filter buku</h4>
        </strong>
        <hr />
        <ListGroup>
          {categories && categories.map((category) => (
            <ListGroup.Item key={category.id}

              onClick={() => ChangeCategory(category.nama)}
              className={categoryTerpilih === category.nama && "category-aktif"}
              style={{ cursor: 'pointer' }}
            >
              <h9>
                {category.nama}
              </h9>

            </ListGroup.Item>
          ))}


        </ListGroup>
      </Col>
    );
  }
}
