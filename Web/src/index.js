import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "assets/css/nucleo-icons.css";
import "assets/scss/blk-design-system-react.scss?v=1.2.0";
import "assets/demo/demo.css";

import Draw from './Draw';
import NewDraw from './NewDraw';
import BrowseDrawings from './BrowseDrawings';

// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";

ReactDOM.render(
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Draw} Id="home" />
        <Route exact path="/draw/:id" component={Draw} />
        <Route exact path="/draw" component={NewDraw} />
        <Route exact path="/browse" component={BrowseDrawings} />
      </Switch>
      <Footer />
    </BrowserRouter>,
    document.getElementById("root")
    );
