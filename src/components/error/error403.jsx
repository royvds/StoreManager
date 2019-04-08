import React, { Component } from "react"
import { BrowserRouter } from 'react-router-dom'

export default class Error403 extends Component {
  render() {
    return (
      <div className="error">
        <h1>Error 403 - You lack the priviliges needed for this action</h1>
      </div>
    );
  }
}
