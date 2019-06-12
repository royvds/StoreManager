import ButterToast, { Cinnamon } from 'butter-toast';
import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import AuthService from '../../services/AuthService'

const authService = new AuthService()
const cookies = new Cookies()
const jwtDecode = require('jwt-decode')

require('../../stylesheets/login.sass')

export default class Login extends Component {
  constructor(props) {
    super(props)
    if (cookies.get('jwt') != undefined)
      props.history.push('/')
  }

  login(email, pass, e) {
    e.preventDefault()

    const user = {
      username: email,
      password: pass
    }

    authService.login(user).catch((error) => {
    console.log(error)
      if (error.response === undefined)
        ButterToast.raise({
            timeout: 5000,
            content: <Cinnamon.Crisp scheme={Cinnamon.Crisp.SCHEME_RED}
                content={() => <p>We could not connect to the REST service, please try again later.</p>}
                title='Login Failed'/>
        })
      else if (error.response.status == 400 || error.response.status == 401)
        ButterToast.raise({
            timeout: 5000,
            content: <Cinnamon.Crisp scheme={Cinnamon.Crisp.SCHEME_ORANGE}
                content={() => <p>Please make sure that you have filled everything in correctly.</p>}
                title='Login Failed'/>
        })
      else
        ButterToast.raise({
            timeout: 5000,
            content: <Cinnamon.Crisp scheme={Cinnamon.Crisp.SCHEME_RED}
                content={() => <p>An unknown error occured, please try again later.</p>}
                title='Login Failed'/>
        })
      })
    this.props.history.push('/')
  }

  render() {
    return (
      <div className='view-wrapper'>
        <form id='loginForm' onSubmit={(e) =>
            this.login(document.getElementById('loginForm-email').value,
            document.getElementById('loginForm-password').value, e)}>
          <input type='text' id='loginForm-email' placeholder='e-mail adres' />
          <input type='password' id='loginForm-password' placeholder='wachtwoord' />
          <button id='loginForm-submit'>Login</button>
        </form>
      </div>
    )
  }
}
