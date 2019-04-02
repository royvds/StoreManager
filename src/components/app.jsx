import React, { Component } from 'react'
import Routes from '../routes'
import { Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import Nav from '../components/shared/nav'

import Home from './views/home'
import Login from './views/login'

export default class App extends Component {
  render() {
    return (
      <div>
        <Nav />

        <Routes />
      </div>
    );
  }
}
