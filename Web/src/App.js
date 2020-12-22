import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Draw from './Draw';
import NewDraw from './NewDraw';
import NavBar from './NavBar';

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
      <React.StrictMode>
        <div>
          <div className="content-box">
            <NavBar></NavBar>
          </div>

          <div class=".float-container">
            <div class="left-menu">
              <div className="content-box">
                TEst
              </div>
            </div>

            <div class="right-content">
              <div className="content-box">
                <Router>
                  <Route exact path="/" component={Draw} />
                  <Route exact path="/draw/:id" component={Draw} />
                  <Route exact path="/draw" component={NewDraw} />
                </Router>
              </div>
            </div>
          </div>
        </div>
      </React.StrictMode >
    );
  }
}
export default App;