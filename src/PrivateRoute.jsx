import React from 'react'
import { Route } from 'react-router'
import { Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie'

const cookies = new Cookies()
const jwtDecode = require('jwt-decode')

function PrivateRoute ({component: Component, allowedRoles, ...rest}) {
  let jwtCookie = cookies.get('jwt')

  if (
    ((allowedRoles.indexOf('ROLE_ANONYMOUS') != -1) && jwtCookie == undefined) ||
    ((allowedRoles.indexOf('ROLE_AUTHENTICATED') != -1) && jwtCookie != undefined) ||
    ((jwtCookie != undefined && allowedRoles.indexOf(jwtDecode(jwtCookie.accessToken).role) != -1))
  ) {
    return (
      <Route {...rest}
        render = { (props) => <Component {...props} /> } />
    )
  }
  else if (jwtCookie == undefined) {
    return (
      <Route {...rest} render={(props) =>
          <Redirect to={{pathname: '/login'}} />} />
    )
  }
  else {
    return (
      <Route {...rest} render={(props) =>
          <Redirect to={{pathname: '/403'}} />} />
    )
  }
}

export default PrivateRoute
