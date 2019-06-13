import axios from 'axios/index'
import React from 'react'
import Principal from "../utils/Principal";

require("babel-polyfill")

export default class AuthService {
  async login(data) {
    const response = await axios({
      method: 'post',
      url: 'http://localhost:8090/api/auth/signin',
      data: data
    })
    Principal.setJwt(response.data)
  }
}