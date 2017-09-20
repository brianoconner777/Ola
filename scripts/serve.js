const express = require('express');
const path = require('path');
const chalk = require('chalk');
const compression = require('compression');
const httpProxy = require('http-proxy');
const app = express();
const proxy = httpProxy.createProxyServer({
  target: 'http://localhost:2000/api',
  ws: true
});
app.use(compression());

app.set('port', 3000);
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.use('/api', (req, res) => {
  proxy.web(req, res, {
    target: 'http://localhost:2000/api'
  });
});

app.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  var json;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent && res.writeHead) {
    res.writeHead(500, {
      'content-type': 'application/json'
    });
  }

  json = {
    error: 'proxy_error',
    reason: error.message
  };
  res.end(JSON.stringify(json));
});

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});


app.listen(3000, function() { 
	console.log();
	console.log(chalk.green('client server started. visit http://localhost:3000'))
});