import React, { Component, Fragment } from 'react';
import './App.css';
import Canvas from './Canvas';
import { BlockPicker } from 'react-color'

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

  render() {
    return (
      <Fragment>
        <div class=".float-container">
          <div class="left-menu">
            <div className="content-box">
              <BlockPicker
                color={this.state.color}
                onChangeComplete={(color) => { this.hangleChangeColor(color.hex) }} />
            </div>
          </div>

          <div class="right-content">
            <div className="content-box">
              <h3 style={{ textAlign: 'center' }}>{this.state.painting.name}</h3>

              <Canvas ref={this.canvasElement} roomId={this.state.roomId} name={this.state.userName} color={this.state.color} />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default Draw;