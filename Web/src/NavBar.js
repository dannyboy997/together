import React, { Component, Fragment } from 'react';
import './App.css';

class NavBar extends Component {
  constructor(props) {
    super(props);
    const id = props.match?.params?.id ?? this.props.roomId;

    this.state = {
    };
  }

  render() {
    return (
      <Fragment>
        <div className="main">
          <a href="/">Home</a>
        </div>
      </Fragment>
    );
  }
}
export default NavBar;