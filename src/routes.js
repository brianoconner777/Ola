import React from 'react';
import { IndexRoute, Route, Router } from 'react-router';
import App from './App';
import DriverApp from './Driver/DriverApp';
import CustomerApp from './Customer/CustomerApp';
import DashboardApp from './Dashboard/DashboardApp';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App} >
      <Route path="driverApp" component={DriverApp} />
      <Route path="customerApp" component={CustomerApp} />
      <Route path="dashboardApp" component={DashboardApp} />
    </Route>
  </Router>
);

export default Routes;