import React, { Component } from 'react'
import { Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie'

const cookies = new Cookies()
const jwtDecode = require('jwt-decode')
const jwtCookie = cookies.get('jwt')

import Home from '../home/home'
import Login from '../login/login'

require('../../stylesheets/nav.sass')

export default class Nav extends Component {
  logout() {
    cookies.remove('jwt')
  }

  render() {
    return (
      <nav className='noselect'>
        <img src='/images/logo-small.png' alt='Logo'/>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/login' onClick={this.logout}>Logout</Link></li>
        </ul>
      </nav>
    )
  }
}
