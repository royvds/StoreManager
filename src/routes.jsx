import React, { Component } from 'react'
import { Route } from 'react-router'
import { Switch, Redirect } from 'react-router-dom'
import PrivateRoute from './PrivateRoute.jsx'

import App from './components/app'
import Home from './components/home/home'
import Login from './components/login/login'
import Planner from './components/planner/planner'
import Error404 from './components/error/error404'
import Error403 from './components/error/error403'

const routes = ({props}) => (
  <Switch >
    <Route path='/login' component={Login} />

    <PrivateRoute allowedRoles={'ROLE_AUTHENTICATED'} exact path='/' component={Home} />

    <Route path='/planner' component={Planner} />

    <Route path='/403' component={Error403} />
    <Route path='/404' component={Error404} />
    <Redirect to='/404' />
  </Switch >
)

export default routes;
