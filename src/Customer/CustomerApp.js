import React, { Component } from 'react';
import client from '../util/HttpClient';

import { Row, Col, Tabs, Tab } from 'react-bootstrap';

class CustomerApp extends Component {
  constructor(props) {
    super(props);
    this.processing = false;
  }
  placeRequest = (customerId, locationX, locationY) => {
    if(customerId && locationX && locationY && !this.processing) {
      this.processing = true;
      const payload = {
        customerId,
        location: {
          x: locationX,
          y: locationY
        }
      };
      client.post('/request', payload)
      .then(resp => {
        console.log(resp);
        if(resp && !resp.err) {
          alert('Request placed successfully');
        }
        this.processing = false;
      })
      .catch(err => {
        console.log(err);
        this.processing = false;
      });
    }
  }

  validateLocation = (x, y) => {
    if(x && y) {
      const locX = parseInt(x, 10);
      const locY = parseInt(y, 10);
      return locX<=5 && locY<=5 && locX>=0 && locY>=0;
    }
    return false;
  }

  onSubmit = (e) => {
    e.preventDefault();
    const customerId = this.inputNode.value;
    const locationX = this.locationX.value;
    const locationY = this.locationX.value;
    const validated = this.validateLocation(locationX, locationY);
    if(customerId && validated) {
      this.placeRequest(customerId, locationX, locationY);
    }
    else {
      alert('Please fill all inputs correctly.');
    }
  }
  render() {
    console.log('CustomerApp render');
    return (
      <div>
        <Tabs defaultActiveKey={1} id="main-tabs">
          <Tab eventKey={1} title="Request">
            <form onSubmit={this.onSubmit}>
              <label>Customer Id: </label>
              <input type='text' ref={(node) => this.inputNode = node} />
              <label>Location(x): </label>
              <input type='text' ref={(node) => this.locationX = node} />
              <label>Location(y): </label>
              <input type='text' ref={(node) => this.locationY = node} />
              <button type="submit">Submit</button>
            </form>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default CustomerApp;
