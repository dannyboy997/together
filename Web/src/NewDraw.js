import React, { Component, Fragment } from 'react';
import './App.css';

class NewDraw extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paintingName: ''
    };

    this.onChangeName = this.onChangeName.bind(this);
    this.createSave = this.createSave.bind(this);
  }

  //serviceUrl = 'https://localhost:44386';
  serviceUrl = 'https://togetherservice.azurewebsites.net';

  onChangeName(event) {
    this.setState({ paintingName: event.target.value });
  }

  async createSave() {
    const body = {
      name: this.state.paintingName
    };

    await fetch(`${this.serviceUrl}/painting`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  render() {
    return (
      <Fragment>
        <div className="main">
          <div>
            Name: <input type="textbox" value={this.state.paintingName} onChange={this.onChangeName} />
          </div>
          <div>
            Public: <input type="radio"></input>
          </div>
          <div>
            <button onClick={this.createSave}></button>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default NewDraw;