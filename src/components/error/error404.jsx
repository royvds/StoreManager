import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'

export default class Error404 extends Component {
  render() {
    return (
      <div className='view-wrapper error'>
        <h1>Error 404 - page not found</h1>
      </div>
    );
  }
}
