import React, { Component, Fragment } from 'react';

// reactstrap components
import {
  Container,
  Row,
  Col,
} from "reactstrap";

class NewDraw extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paintingName: ''
    };

    this.onChangeName = this.onChangeName.bind(this);
    this.createSave = this.createSave.bind(this);
  }

  //serviceUrl = 'https://localhost:44386';
  serviceUrl = 'https://togetherservice.azurewebsites.net';

  onChangeName(event) {
    this.setState({ paintingName: event.target.value });
  }

  async createSave() {
    const body = {
      name: this.state.paintingName
    };

    var response = await fetch(`${this.serviceUrl}/painting`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json',
      },
    });

    if (response.text === null || response.text === undefined || response.status !== 200) {
      return;
    }

    const painting = await response.json();

    window.location = `/draw/${painting.key}`;
  }

  render() {
    return (
      <div className="wrapper">
        <div className="section">
          <Container>
          <Row className="row-grid justify-content-between align-items-center text-center">
              <Col lg>
                <h1 className="text-white">
                New Drawing
                </h1>
              </Col>
            </Row>
            <Row className="justify-content-between">
              <Col md="5">
                <Fragment>
                  <div className=".float-container">
                    <div className="right-content">
                      <div className="content-box">

                        <div className="inner">
                          Name: <input type="textbox" value={this.state.paintingName} onChange={this.onChangeName} />
                        </div>
                        <div className="inner">
                          Public: <input type="checkbox" checked="true" disabled="true"></input>
                        </div>
                        <div className="inner">
                          <button class="menu-button" onClick={this.createSave}>Create Drawing</button>
                        </div>
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
export default NewDraw;