import Cookies from 'universal-cookie'
import axios from 'axios/index'
import React from 'react'

require("babel-polyfill")

const cookies = new Cookies()

export default class AuthService {
    async login(data) {
        const response = await axios({
            method: 'post',
            url: 'http://localhost:8090/api/auth/signin',
            data: data
        })

        cookies.set('jwt', response.data)
    }
}