import React, { Component, Fragment } from 'react';
import './App.css';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <Fragment>
        <div className="menu-div">
          <a className="menu-button" href="/">Home</a>
          <a className="menu-button" href="/draw">New Drawing</a>
        </div>
      </Fragment>
    );
  }
}
export default NavBar;