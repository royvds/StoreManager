import jwt from './data/jwt.json'
import Cookies from 'universal-cookie'
import axios from 'axios/index'
import React from 'react'

require("babel-polyfill")

const cookies = new Cookies()

export default class AuthService {
    async login(data) {
        cookies.set('jwt', jwt)
    }
}