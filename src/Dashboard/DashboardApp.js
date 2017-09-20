import React, { Component } from 'react';
import client from '../util/HttpClient';

import { Row, Col, Tabs, Tab, Table } from 'react-bootstrap';

import moment from 'moment';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updating: false,
      requests: []
    };
  }

  refreshData = () => {
    this.setState({
      updating: true
    }, () => {
      this.fetchRequests();
    });
  }

  fetchRequests = () => {
    client.get('/requests')
    .then(resp => {
      if(resp) {
        this.setState({
          requests: resp.requests,
          updating: false
        });
      }
    })
    .catch(err => {
      console.log(err);
      this.setState({
        updating: false
      });
    });
  }

  timeElapsed = (time) => {
    if(time) {
      var now = moment(new Date());
      var end = moment(time);
      var duration = moment.duration(now.diff(end));
      var minutes = parseInt(duration.asMinutes());
      var seconds = parseInt(duration.asSeconds())-minutes*60;
      const timeElapsed = `${minutes} minutes and ${seconds} seconds.`;
      return timeElapsed;
    }
  }

  componentDidMount() {    
    this.fetchRequests();
  }

  render() {
    return (
      <div>
        <div>
          {this.state.updating && <div>Refreshing data...</div>}
          <button onClick={this.refreshData}>Refresh Data</button>
        </div>
        <Tabs defaultActiveKey={1} id="main-tabs">
          <Tab eventKey={1} title="Requests">
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>Request Id</th>
                  <th>Customer Id</th>
                  <th>Time Elapsed</th>
                  <th>Status</th>
                  <th>Driver</th>
                </tr>
              </thead>
              <tbody style={{textAlign: 'left'}}>
                {this.state.requests && this.state.requests.map((request, index) => {
                  return (
                    <tr key={index} style={{padding: 5}}>
                      <td>{request.requestId}</td>
                      <td>{request.customer.customerId}</td>
                      <td>{this.timeElapsed(request.createdAt)}</td>
                      <td>{request.status}</td>
                      <td>{request.driver.driverId}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default Dashboard;
