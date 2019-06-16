import employees from './data/employees.json'
import uuidv1 from 'uuid/v1'
import React from 'react'

require("babel-polyfill")

export default class UserService {
    async getUsers() {
        let output = []
        employees.forEach(user => {
            output.push({
                key: uuidv1(),
                id: user.id,
                name: user.name,
                role: user.roles[0]
            })
        })

        return new Promise(resolve => resolve(output))
    }
}
