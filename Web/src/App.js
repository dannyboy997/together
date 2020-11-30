import React, { Component, Fragment } from 'react';
import './App.css';
import Canvas from './Canvas';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: 'Public',
      userName: ''
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
            <h5>Color Guide</h5>
            <div className="user user">User</div>
            <div className="user guest">Guest</div>
          </div>
          <Canvas roomId={this.state.roomId} name={this.state.userName} />
        </div>
      </Fragment>
    );
  }
}
export default App;