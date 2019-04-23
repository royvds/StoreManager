import ButterToast, { Cinnamon, POS_TOP, POS_RIGHT } from 'butter-toast';
import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'

import nav from '../shared/nav'

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

    axios({
      method: 'post',
      url: 'http://localhost:8090/api/auth/signin',
      data: user
    })
    .then((res) => {
      if (res.status == 200) {
        cookies.set('jwt', res.data)
        this.props.history.push('/')
      }
    })
    .catch((error) => {
      if (error.response === undefined)
        ButterToast.raise({
            timeout: 5000,
            content: <Cinnamon.Crisp scheme={Cinnamon.Crisp.SCHEME_RED}
                content={() => <p>We could not connect to the REST service, please try again later.</p>}
                title='Login Failed'/>
        })
      else if (error.response.status === 400)
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
  }

  render() {
    return (
      <div className='view-wrapper'>
        <form id='loginForm' onSubmit={(e) =>
            this.login(document.getElementById('loginForm-email').value,
            document.getElementById('loginForm-password').value, e)}>
          <input type='text' id='loginForm-email' placeholder='e-mail adres'></input>
          <input type='password' id='loginForm-password' placeholder='wachtwoord'></input>
          <button>Login</button>
        </form>
      </div>
    );
  }
}
