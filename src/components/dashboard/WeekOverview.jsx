import React, { Component } from 'react'
import axios from 'axios/index'
import Principal from "../../utils/Principal"
import { DateTime, Info } from 'luxon'

require('./Dashboard.sass')
require("babel-polyfill")

export default class Dashboard extends Component {
  state = {
    tasks: []
  }

  async componentDidMount() {
    const response = await axios({
      method: 'get',
      url: `http://localhost:8090/api/planner/user/${this.props.userId}?year=${this.props.year}&week=${this.props.week}`,
      headers: {
        Authorization: Principal.getAuthorizationHeader()
      }
    })
    await this.setState({tasks: response.data})

    this.state.tasks.forEach(task => {
      // Convert Date strings to Date Objects
      task.beginDateTime = new Date(task.beginDateTime)
      task.endDateTime = new Date(task.endDateTime)

      let index = task.beginDateTime.getDay()
      document.getElementById(`overview-${Info.weekdays()[index == 0 ? 6 : index-1].toLowerCase()}`)
        .insertAdjacentHTML('beforeend',
          `<div class='week-overview-day'>` +
          `<p>${task.beginDateTime.getHours() + ':' + task.beginDateTime.getMinutes()}</p>` +
          `<p>&nbsp;-&nbsp;</p>` +
          `<p>${task.endDateTime.getHours() + ':' + task.endDateTime.getMinutes()}</p>` +
          `</div>`)
    })

    let removeNodes = []
    document.getElementById('comp-week-overview')
      .childNodes.forEach(node => { if (node.childElementCount == 1) removeNodes.push(node) })
    removeNodes.forEach(node => node.parentNode.removeChild(node))
  }

  render() {
    return (
      <div id='comp-week-overview'>
        {Info.weekdays().map((value, index) => {
          return <div id={`overview-${value.toLowerCase()}`} key={index}>
            <h3>{value}</h3>
          </div>
        })}
      </div>
    )
  }
}
