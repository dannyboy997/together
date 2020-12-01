import React, { Component, Fragment } from 'react';
import './App.css';
import Canvas from './Canvas';
import { BlockPicker } from 'react-color'

class Draw extends Component {
  constructor(props) {
    super(props);
    const { id } = props.match.params;

    this.state = {
      roomId: id,
      userName: '',
      format: ''
    };

    this.handleRoomIdChange = this.handleRoomIdChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleRoomIdChange(event) {
    this.setState({ roomId: event.target.value });
  }

  handleNameChange(event) {
    this.setState({ userName: event.target.value });
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
                color={ this.state.background }
                onChangeComplete={(color) => { (this.setState({format: color.hex})) }} />
            </div>
            <h5>Color Guide</h5>
            <div className="user user">User</div>
            <div className="user guest">Guest</div>
          </div>
          <Canvas roomId={this.state.roomId} name={this.state.userName} format={this.state.format} />
        </div>
      </Fragment>
    );
  }
}
export default Draw;