import React, { Component } from "react";
import { Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom';
import { Link } from 'react-router-dom'

import Home from '../views/home'
import Login from '../views/login'

export default class Header extends Component {
  render() {
    return (
      <nav>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/home'>Home</Link></li>
          <li><Link to='/login'>Login</Link></li>
        </ul>
      </nav>
    );
  }
}
