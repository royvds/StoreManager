import React from 'react';
import ReactDOM from 'react-dom';
import { Router, BrowserRouter } from 'react-router-dom';

import routes from './routes';
import App from './components/app'

require('./stylesheets/style.sass');

ReactDOM.render((
  <BrowserRouter routes={routes}>
    <App />
  </BrowserRouter>
), document.getElementById('app'));

module.hot.accept()
