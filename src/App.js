import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import client from './util/HttpClient';

import { Row, Col, Tabs, Tab } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default App;
