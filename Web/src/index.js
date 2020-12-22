import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Draw from './Draw';
import NewDraw from './NewDraw';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route exact path="/" component={App} />
      <Route exact path="/draw/:id" component={Draw} />
      <Route exact path="/draw" component={NewDraw} />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
