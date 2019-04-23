import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'

import nav from '../shared/nav'
import App from '../app'

export default class Home extends Component {
  render() {
    return (
      <div className='view-wrapper'>
        <h1>This is the home page.</h1>
      </div>
    )
  }
}
