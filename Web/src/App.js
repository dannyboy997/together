import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Draw from './Draw';
import NewDraw from './NewDraw';
import NavBar from './NavBar';
import BrowseDrawings from './BrowseDrawings';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: 'Public',
      userName: ''
    };
  }

  render() {
    return (
      <React.StrictMode>
        <div>
          <div className="content-box">
            <NavBar></NavBar>
          </div>

          <Router>
            <Route exact path="/" component={Draw} />
            <Route exact path="/draw/:id" component={Draw} />
            <Route exact path="/draw" component={NewDraw} />
            <Route exact path="/browse" component={BrowseDrawings} />
          </Router>
        </div>
      </React.StrictMode >
    );
  }
}
export default App;