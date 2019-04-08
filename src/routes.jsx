import React from 'react'
import { Route } from 'react-router'
import { BrowserRouter, Switch, Redirect } from 'react-router-dom'

import App from './components/app'
import Home from './components/views/home'
import Login from './components/views/login'
import Error404 from './components/error/error404'

function PrivateRoute ({component: Component, roles, ...rest}) {
  console.log("YASH: " + roles.indexOf("employee"))
  return (
    <Route
      {...rest}
      /* indexOf returns index of -1 when it is not present in the array */
      render={(props) => roles.indexOf("employee") != -1
        ? <Component {...props} />
      : <Redirect to={{pathname: '/403', state: {from: props.location}}} />}
    />
  )
}

const routes = () => (
  <Switch >
    <Redirect from="/home" to="/" />
    <Route exact path="/" component={Home} />

    <PrivateRoute roles={"emplosyee", "sdfsdfsd", "employee"} path="/login" component={Login} />

    <Route component={Error404} />
    <Redirect to="/404" />
  </Switch >
)

export default routes;
