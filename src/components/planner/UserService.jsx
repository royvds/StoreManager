import ButterToast, {Cinnamon} from 'butter-toast'
import Cookies from 'universal-cookie'
import axios from 'axios/index'
import uuidv1 from 'uuid/v1'
import React from 'react'

require("babel-polyfill")

const cookies = new Cookies()

export default class UserService {
  async getUsers() {
    let employees = []

    try {
      const response = await axios({
        method: 'get',
        url: 'http://localhost:8090/api/user',
        headers: {
          Authorization: 'Bearer ' + cookies.get('jwt').accessToken
        }
      })

      response.data.forEach(user => {
        employees.push({
          key: uuidv1(),
          id: user.id,
          name: user.name,
          role: user.roles[0]
        })
      })
    } catch (e) {
      ButterToast.raise({
        timeout: 5000,
        content: <Cinnamon.Crisp scheme={Cinnamon.Crisp.SCHEME_RED}
                                 content={() => <p>Make sure you have an internet connection or try again later.</p>}
                                 title='Could not retrieve users!'/>
      })
    }

    return employees
  }
}