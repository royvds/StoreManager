import Cookies from 'universal-cookie'
import React from 'react'
import tasks from './data/tasks.json'

require("babel-polyfill")

const cookies = new Cookies()

export default class TaskService {
  async getUserTasks(year, week, userId) {
    return new Promise(resolve => resolve(tasks))
  }
}