import React, { Component } from 'react';
import client from '../util/HttpClient';

import { Row, Col, Tabs, Tab, Table } from 'react-bootstrap';
import moment from 'moment';

class DriverApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      driverId: null,
      updating: false,
      accepting: false,
      requests: {
        waiting: [],
        ongoing: [],
        completed: []
      }
    };
  }

  acceptRequest = (request, index) => {
    console.log(this.state.driverId);
    if(request && this.state.driverId) {
      client.post('/request/!accept', {
        _id: request._id,
        driverId: this.state.driverId
      })
      .then(resp => {
        console.log(resp);
        if(resp && resp.updatedRequest && resp.updatedRequest._id) {
          const updatedRequest = resp.updatedRequest;
          const requests = this.state.requests;
          requests.waiting.splice(index, 1);
          requests.ongoing.push(updatedRequest);
          this.setState({
            requests,
            accepting: false
          }, () => {
            alert('Request Accepted!');
          });
        }
        else {
          this.setState({
            accepting: false
          }, () => {
            alert('Request Could not be accepted. Please try again.');
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          accepting: false
        }, () => {
          alert('Request Could not be accepted. Please try again.');
        });
      });
    }
    else {
      this.setState({
        accepting: false
      }, () => {
        alert('Request Could not be accepted. Please try again.');
      });
    }
  }

  selectRequest = (request, index) => {
    if(this.state.requests.ongoing.length>0) {
      return alert('Another request in ongoing. Cannot accept new request.');
    } 
    else if(request && !this.state.accepting) {
      console.log('Select request ');
      console.log(request);
      this.setState({
        accepting: true
      }, () => {
        client.post('/request/!validate', {
          _id: request._id
        })
        .then(resp => {
          if(resp && resp.validated) {
            this.acceptRequest(request, index);
          }
          else {
            alert('The request is no longer valid.');
            this.refreshData();
            this.setState({
              accepting: false
            });
          }
        });
      });
    }
  }

  refreshData = () => {
    this.setState({
      updating: true
    }, () => {
      this.fetchRequests();
    });
  }

  fetchRequests = () => {
    if(this.state.driverId) {
      const driverId = this.state.driverId;
      const query = {
        driverId
      };
      client.get('/requests/!driver', query)
      .then(resp => {
        if(resp) {
          this.setState({
            requests: Object.assign({}, this.state.requests, resp),
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
  }
  timeElapsedCustom = (time) => {
    if(time) {
      var now = moment(new Date());
      var end = moment(time, 'dddd, MMMM Do YYYY, h:mm:ss a');
      var duration = moment.duration(now.diff(end));
      var minutes = parseInt(duration.asMinutes());
      const timeElapsed = `${Math.floor(minutes)} minutes ago.`;
      return timeElapsed;
    }
  }
  timeElapsed = (time) => {
    if(time) {
      var now = moment(new Date());
      var end = moment(time);
      var duration = moment.duration(now.diff(end));
      var minutes = parseInt(duration.asMinutes());
      const timeElapsed = `${Math.floor(minutes)} minutes ago.`;
      return timeElapsed;
    }
  }
  componentDidMount() {
    if(this.props.location.query && this.props.location.query.id) {
      this.setState({
        driverId: this.props.location.query.id
      }, () => {
        this.fetchRequests();
      });
    }
  }
  render() {
    return (
      <div>
        <div>
          {this.state.updating && <div>Refreshing data...</div>}
          <button onClick={this.refreshData}>Refresh Data</button>
        </div>
        <Tabs defaultActiveKey={1} id="main-tabs">
          <Tab eventKey={1} title="Waiting">
            <Table>
              <thead>
                <tr>
                  <th>Request Id</th>
                  <th>Customer Id</th>
                  <th>Received</th>
                  <th></th>
                </tr>
              </thead>
              <tbody style={{textAlign: 'left'}}>
                {this.state.requests && this.state.requests.waiting && this.state.requests.waiting.map((request, index) => {
                  return (
                    <tr key={index} style={{padding: 5}}>
                      <td>{request.requestId}</td>
                      <td>{request.customer.customerId}</td>
                      <td>{this.timeElapsed(request.createdAt)}</td>
                      <td><button onClick={() => this.selectRequest(request, index)}>Select</button></td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </Tab>
          <Tab eventKey={2} title="Ongoing">
            <Table>
              <thead>
                <tr>
                  <th>Request Id</th>
                  <th>Customer Id</th>
                  <th>Received</th>
                  <th>Picked Up</th>
                </tr>
              </thead>
              <tbody style={{textAlign: 'left'}}>
                {this.state.requests && this.state.requests.ongoing && this.state.requests.ongoing.map((request, index) => {
                  return (
                    <tr key={index} style={{padding: 5}}>
                      <td>{request.requestId}</td>
                      <td>{request.customer.customerId}</td>
                      <td>{this.timeElapsed(request.createdAt)}</td>
                      <td>{this.timeElapsedCustom(request.pickedUpAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </Tab>
          <Tab eventKey={3} title="Completed">
            <Table>
              <thead>
                <tr>
                  <th>Request Id</th>
                  <th>Customer Id</th>
                  <th>Received</th>
                  <th>Picked Up</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody style={{textAlign: 'left'}}>
                {this.state.requests && this.state.requests.completed && this.state.requests.completed.map((request, index) => {
                  return (
                    <tr key={index} style={{padding: 5}}>
                      <td>{request.requestId}</td>
                      <td>{request.customer.customerId}</td>
                      <td>{this.timeElapsed(request.createdAt)}</td>
                      <td>{this.timeElapsedCustom(request.pickedUpAt)}</td>
                      <td>{this.timeElapsedCustom(request.completedAt)}</td>
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

export default DriverApp;
