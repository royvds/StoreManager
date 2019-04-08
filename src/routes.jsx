import React from 'react'
import { Route } from 'react-router'
import { BrowserRouter, Switch, Redirect } from 'react-router-dom'

import App from './components/app'
import Home from './components/views/home'
import Login from './components/views/login'
import Error404 from './components/error/error404'

const routes = () => (
  <Switch >
    <Redirect from="/home" to="/" />
    <Route exact path="/" component={Home} />
    <Route path="/login" component={Login} />

    <Route component={Error404} />
    <Redirect to="/404" />
  </Switch >
)

export default routes;
