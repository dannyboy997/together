import React, { Component, Fragment } from 'react';
import './App.css';
import Canvas from './Canvas';
import { BlockPicker } from 'react-color'

class Draw extends Component {
  constructor(props) {
    super(props);
    const id = props.match?.params?.id;

    this.state = {
      roomId: id,
      userName: '',
      color: '#ff0000'
    };

    this.handleRoomIdChange = this.handleRoomIdChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.hangleChangeColor = this.hangleChangeColor.bind(this);

    this.canvasElement = React.createRef();
  }

  handleRoomIdChange(event) {
    this.setState({ roomId: event.target.value });
  }

  handleNameChange(event) {
    this.setState({ userName: event.target.value });
  }

  hangleChangeColor(color) {
    this.setState({ color: color });
    this.canvasElement.current.changeFormat(this.state.color);
  }

  render() {
    return (
      <Fragment>
        <h3 style={{ textAlign: 'center' }}>Paint</h3>
        <div className="main">
          <div className="color-guide">
            <div>
              Room Name: <input type="text" value={this.state.roomId} onChange={this.handleRoomIdChange} />
            </div>
            <div>
              Name: <input type="text" value={this.state.userName} onChange={this.handleNameChange} />
            </div>
            <div>
              <BlockPicker
                color={ this.state.color }
                onChangeComplete={(color) => { this.hangleChangeColor(color.hex) } } />
            </div>
            <h5>Color Guide</h5>
            <div className="user user">User</div>
            <div className="user guest">Guest</div>
          </div>
          <Canvas ref={this.canvasElement} roomId={this.state.roomId} name={this.state.userName} format={this.state.color} />
        </div>
      </Fragment>
    );
  }
}
export default Draw;