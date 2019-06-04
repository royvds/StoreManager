import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import routes from './Routes'
import App from './components/App'

require('./stylesheets/style.sass')

ReactDOM.render((
  <BrowserRouter routes={routes}>
    <App />
  </BrowserRouter>
), document.getElementById('app'))

module.hot.accept()
