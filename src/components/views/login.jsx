import React, { Component } from "react"
import { BrowserRouter } from 'react-router-dom'

require('../../stylesheets/login.sass')

export default class Login extends Component {
  render() {
    return (
      <div className="view-wrapper">
        <h1>This is the login page.</h1>
      </div>
    );
  }
}
