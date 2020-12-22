import React, { Component, Fragment } from 'react';
import './App.css';

class NewDraw extends Component {
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
          <input type="textbox" />
        </div>
      </Fragment>
    );
  }
}
export default NewDraw;