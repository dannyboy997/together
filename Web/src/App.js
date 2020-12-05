import React, { Component, Fragment } from 'react';
import './App.css';
import Draw from './Draw';


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
          <Draw id = "main" />
        </div>
      </Fragment>
    );
  }
}
export default App;