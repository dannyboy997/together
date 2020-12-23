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
      final.push(<li key={painting.Name}><a href={`/draw/${painting.Key}`}>{painting.Name}</a></li>);
    }

    return (
      <Fragment>
        <div className="main">
          <ul>{final}</ul>
        </div>
      </Fragment>
    );
  }
}
export default BrowseDrawings;