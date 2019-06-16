import Cookies from 'universal-cookie'
const jwtDecode = require('jwt-decode')
const cookies = new Cookies()

export default class Principal {
  static setJwt(token) {
    cookies.set('jwt', token)
  }

  static deleteJwt() {
    cookies.remove('jwt')
  }

  static getId() {
    return jwtDecode(cookies.get('jwt').accessToken).sub
  }

  static getUserName() {
    return jwtDecode(cookies.get('jwt').accessToken).username
  }

  static getName() {
    return jwtDecode(cookies.get('jwt').accessToken).name
  }

  static getRole() {
    return jwtDecode(cookies.get('jwt').accessToken).role
  }

  static getAccessToken() {
    return cookies.get('jwt').accessToken
  }

  static getAuthorizationHeader() {
    return 'Bearer ' + this.getAccessToken()
  }
}

