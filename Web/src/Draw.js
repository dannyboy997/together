import React, { Component, Fragment } from 'react';
import Canvas from './Canvas';
import { BlockPicker } from 'react-color'
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
// reactstrap components
import {
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import Footer from "components/Footer/Footer.js";

class Draw extends Component {
  constructor(props) {
    super(props);
    const id = props.match?.params?.id ?? this.props.roomId;

    this.state = {
      roomId: id,
      userName: '',
      color: '#ff0000',
      painting: {
        name: ""
      }
    };

    this.hangleChangeColor = this.hangleChangeColor.bind(this);

    this.canvasElement = React.createRef();
  }

  //serviceUrl = 'https://localhost:44386';
  serviceUrl = 'https://togetherservice.azurewebsites.net';

  async getPaintingData() {
    const response = await fetch(`${this.serviceUrl}/painting/${this.state.roomId}`, {
      method: 'get',
      headers: {
        'content-type': 'application/json',
      },
    });

    if (response.text === null || response.text === undefined || response.status !== 200) {
      return;
    }

    const painting = await response.json();

    if (painting == null) {
      return;
    }

    this.setState({ painting: painting });
  }

  componentDidMount() {
    this.getPaintingData();
  }

  hangleChangeColor(color) {
    this.setState({ color: color });
    this.canvasElement.current.changeFormat(this.state.color);
  }

  ps = null;

  useEffect() {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        this.ps = new PerfectScrollbar(tables[i]);
      }
    }
    document.body.classList.toggle("profile-page");
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        this.ps.destroy();
        document.documentElement.className += " perfect-scrollbar-off";
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
      document.body.classList.toggle("profile-page");
    };
  }

  render() {
    return (
      <div>
        <ExamplesNavbar />
        <div className="wrapper">
          <div className="section">
            <Container>
              <Row className="justify-content-between">
                <Col md="6">
                  <Row className="justify-content-between align-items-center">
                  </Row>
                </Col>
                <Col md="5">
                  <Fragment>
                    <div className=".float-container">
                      <div className="left-menu">
                        <div className="content-box">
                          <BlockPicker
                            color={this.state.color}
                            onChangeComplete={(color) => { this.hangleChangeColor(color.hex) }} />
                        </div>
                      </div>

                      <div className="right-content">
                        <div className="content-box">
                          <h3 style={{ textAlign: 'center' }}>{this.state.painting.name}</h3>

                          <Canvas ref={this.canvasElement} roomId={this.state.roomId} name={this.state.userName} color={this.state.color} />
                        </div>
                      </div>
                    </div>
                  </Fragment>
                </Col>
              </Row>
            </Container>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
export default Draw;