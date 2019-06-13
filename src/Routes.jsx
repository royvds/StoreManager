import React from 'react'
import { Route } from 'react-router'
import { Switch, Redirect } from 'react-router-dom'
import PrivateRoute from './PrivateRoute.jsx'

import Dashboard from './components/dashboard/Dashboard'
import Login from './components/login/Login'
import Planner from './components/planner/Planner'
import Error404 from './components/error/Error404'
import Error403 from './components/error/Error403'

const routes = ({props}) => (
  <Switch >
    <Route path='/login' component={Login} />

    <PrivateRoute allowedRoles={'ROLE_AUTHENTICATED'} exact path='/' component={Dashboard} />

    <Route path='/planner' component={Planner} />

    <Route path='/403' component={Error403} />
    <Route path='/404' component={Error404} />
    <Redirect to='/404' />
  </Switch >
)

export default routes
