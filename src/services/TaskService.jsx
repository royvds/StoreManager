import Cookies from 'universal-cookie'
import axios from 'axios/index'
import React from 'react'
import Principal from '../utils/Principal'

require("babel-polyfill")

const cookies = new Cookies()

export default class TaskService {
  async getUserTasks(year, week, userId) {
    const response = await axios({
      method: 'get',
      url: `http://localhost:8090/api/planner/user/${userId}?year=${year}&week=${week}`,
      headers: {
        Authorization: Principal.getAuthorizationHeader()
      }
    })
    return response.data
  }
}