import React, { Component, Fragment } from 'react';

// reactstrap components
import {
  Container,
  Row,
  Col,
} from "reactstrap";

class BrowseDrawings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paintings: []
    };
  }

  //serviceUrl = 'https://localhost:44386';
  serviceUrl = 'https://togetherservice.azurewebsites.net';

  async getPaintings() {
    const response = await fetch(`${this.serviceUrl}/painting`, {
      method: 'get',
      headers: {
        'content-type': 'application/json',
      },
    });

    if (response.text === null || response.text === undefined || response.status !== 200) {
      return;
    }

    const paintings = await response.json();

    if (paintings == null) {
      return;
    }

    this.setState({ paintings: paintings });
  }

  componentDidMount() {
    this.getPaintings();
  }

  render() {
    const final = [];
    for (let painting of this.state.paintings) {
      final.push(<li key={painting.name}><a href={`/draw/${painting.key}`}>{painting.name}</a></li>);
    }

    return (
      <div className="wrapper">
        <div className="section">
          <Container>
            <Row className="row-grid justify-content-between align-items-center text-center">
              <Col lg>
                <h1 className="text-white">
                  Browse Paintings
                </h1>
              </Col>
            </Row>
            <Row className="justify-content-between">
              <Col md="5">
                <Fragment>
                  <div className=".float-container">
                    <div className="right-content">
                      <div className="content-box">
                        <ul>{final}</ul>
                      </div>
                    </div>
                  </div>
                </Fragment>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}
export default BrowseDrawings;