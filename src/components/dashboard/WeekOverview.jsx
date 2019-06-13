import React, { Component } from 'react'
import TaskService from '../../services/TaskService'
import { Info } from 'luxon'

require('./Dashboard.sass')
require("babel-polyfill")

const taskService = new TaskService()

export default class WeekOverview extends Component {
  state = ({tasks: []})

  async componentDidMount() {
    const tasks = await taskService.getUserTasks(this.props.year, this.props.week, this.props.userId)
    tasks.forEach(task => {
      task.beginDateTime = new Date(task.beginDateTime)
      task.endDateTime = new Date(task.endDateTime)
    })
    this.setState({tasks: tasks})
  }

  arraymove(arr, fromIndex, toIndex) {
    let element = arr[fromIndex]
    arr.splice(fromIndex, 1)
    arr.splice(toIndex, 0, element)
  }

  render() {
    let days = []
    this.state.tasks.forEach(task => {
      if (days.indexOf(task.beginDateTime.getDay()) === -1)
        days.push(task.beginDateTime.getDay())
    })

    days.sort() // sort array, if sunday is first day move it to last position
    if (days[0] == 0) this.arraymove(days, 0, days.length)

    return (
      <div id='comp-week-overview'>
        {days.map((day, index) => {
          return (<div id={`overview-${Info.weekdays()[day == 0 ? 6 : day-1].toLowerCase()}`} key={index}>
            <h3>{Info.weekdays()[day == 0 ? 6 : day-1]}</h3>
            {this.state.tasks.map((task, index) => {
              if (task.beginDateTime.getDay() == day) {return (<div key={index} className='week-overview-day'>
                    <p>{task.beginDateTime.getHours() + ':' + task.beginDateTime.getMinutes()}</p>
                    <p>&nbsp;-&nbsp;</p>
                    <p>{task.endDateTime.getHours() + ':' + task.endDateTime.getMinutes()}</p>
                  </div>)}
            })
          }
          </div>)
        })}
      </div>
    )
  }
}
