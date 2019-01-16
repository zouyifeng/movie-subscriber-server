const express = require('express'),
          app = express(),
     template = require('./views/template')
         path = require('path')
         axios = require('axios');


// Serving static files
app.use('/assets', express.static(path.resolve(__dirname, 'assets')));
app.use('/media', express.static(path.resolve(__dirname, 'media')));

// hide powered by express
app.disable('x-powered-by');
// start the server
app.listen(process.env.PORT || 3000);

// our apps data model
const data = require('./assets/data.json');



//SSR function import
const ssr = require('./views/server');

// server rendered home page
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'assets, max-age=604800')
  axios.get('http://localhost:8089/lastest-movie').then(result => {
    let initialState = {
      isFetching: false,
      apps: result.data
    }
    const { preloadedState, content }  = ssr(initialState)
    const response = template("最新电影", preloadedState, content)
    res.send(response);
  })
});

// Pure client side rendered page
app.get('/client', (req, res) => {
  let response = template('最新电影')
  res.setHeader('Cache-Control', 'assets, max-age=604800')
  res.send(response);
});

// tiny trick to stop server during local development
app.get('/exit', (req, res) => {
  if(process.env.PORT) {
    res.send("Sorry, the server denies your request")
  } else {
    res.send("shutting down")
    process.exit(0)
  }

});
