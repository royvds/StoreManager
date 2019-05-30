import { BrowserRouter } from 'react-router-dom'
import React, { Component } from 'react'
import { Route } from 'react-router'

import Routes from '../routes'
import Nav from './navigation/nav'

import ButterToast, { POS_TOP, POS_RIGHT } from 'butter-toast';

export default class App extends Component {
  render() {
    return (
      <div>
        <ButterToast position={{vertical: POS_TOP, horizontal: POS_RIGHT}} />

        <Nav />

        <Routes />
      </div>
    )
  }
}
