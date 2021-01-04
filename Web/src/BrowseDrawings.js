import React, { Component, Fragment } from 'react';
import './App.css';

class BrowseDrawings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paintings: []
    };
  }

  //serviceUrl = 'https://localhost:44386';
  serviceUrl = 'https://togetherservice.azurewebsites.net';

  async getPaintings() {
    const response = await fetch(`${this.serviceUrl}/painting`, {
      method: 'get',
      headers: {
        'content-type': 'application/json',
      },
    });

    if (response.text === null || response.text === undefined || response.status !== 200) {
      return;
    }

    const paintings = await response.json();

    if (paintings == null) {
      return;
    }

    this.setState({ paintings: paintings });
  }

  componentDidMount() {
    this.getPaintings();
  }

  render() {
    const final = [];
    for (let painting of this.state.paintings) {
      final.push(<li key={painting.name}><a href={`/draw/${painting.key}`}>{painting.name}</a></li>);
    }

    return (
      <Fragment>
        <div className=".float-container">
          <div className="right-content">
            <div className="content-box">
              <h3 style={{ textAlign: 'center' }}>Browse Paintings</h3>

              <ul>{final}</ul>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default BrowseDrawings;