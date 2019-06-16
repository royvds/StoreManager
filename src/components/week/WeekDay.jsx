import React, {Component} from 'react'
import {getTimeFromDate} from "../../utils/Time";

export default class WeekDay extends Component {
  render() {
    const { dayName, tasks } = this.props
    return (
      <div className='comp-week-day'>
        <h3>{dayName}</h3>
        {tasks.map((value, index) => { return (
          <div key={index}>
            <p>{value.name}</p>
            <p>{getTimeFromDate(value.beginDateTime)} - {getTimeFromDate(value.endDateTime)}</p>
          </div>
        )})}
      </div>
    )
  }
}