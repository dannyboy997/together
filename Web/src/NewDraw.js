import React, { Component, Fragment } from 'react';

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

    var response = await fetch(`${this.serviceUrl}/painting`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json',
      },
    });

    if (response.text === null || response.text === undefined || response.status !== 200) {
      return;
    }

    const painting = await response.json();

    window.location = `/draw/${painting.key}`;
  }

  render() {
    return (
      <Fragment>
        <div className=".float-container">
          <div className="right-content">
            <div className="content-box">
              <h3 style={{ textAlign: 'center' }}>New Drawing</h3>

              <div className="inner">
                Name: <input type="textbox" value={this.state.paintingName} onChange={this.onChangeName} />
              </div>
              <div className="inner">
                Public: <input type="radio" checked="true" disabled="true"></input>
              </div>
              <div className="inner">
                <button class="menu-button" onClick={this.createSave}>Create Drawing</button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default NewDraw;