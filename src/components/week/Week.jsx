import React, { Component } from 'react'
import {DateTime} from "luxon";
import {processWeek} from '../../utils/Week'
import UserService from '../../services/UserService'
import WeekService from '../../services/WeekService'
import WeekDay from "./WeekDay";
const userService = new UserService()
const weekService = new WeekService()

require('./Week.sass')

export default class Week extends Component {
  state = {
    tasks: [],
    employees: [],
    week: DateTime.local().weekNumber,
    year: DateTime.local().year,
    monday: [], tuesday: [], wednesday: [], thursday: [],
    friday: [], saturday: [], sunday: []
  }

  constructor(props) {
    super(props)
    this.goToPreviousWeek = this.goToPreviousWeek.bind(this)
    this.goToNextWeek = this.goToNextWeek.bind(this)
  }

  goToPreviousWeek() { this.setState({week: this.state.week - 1}) }
  goToNextWeek() { this.setState({week: this.state.week + 1}) }

  async componentDidMount() {
    await this.setState({employees: await userService.getUsers()})
    this.updateWeek()
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.week != prevState.week || this.state.year != prevState.year){
      this.updateWeek()
    }
  }

  async updateWeek() {
    const week = await processWeek(await weekService.getWeek(this.state.year, this.state.week), this.state.employees)
    this.setState({week: week.weekNumber, year: week.year, monday: week.monday, tuesday: week.tuesday, wednesday: week.wednesday,
      thursday: week.thursday, friday: week.friday, saturday: week.saturday, sunday: week.sunday })
  }

  render() {
    return (
      <div id='comp-week' className='view-wrapper noselect'>
        <div id='overview-header'>
          <p onClick={this.goToPreviousWeek}>&lt;</p>
          <p>Week {this.state.week}</p>
          <p onClick={this.goToNextWeek}>&gt;</p>
        </div>

        <div id='overview-week'>
          <WeekDay tasks={this.state.monday} dayName="Monday" />
          <WeekDay tasks={this.state.tuesday} dayName="Tuesday" />
          <WeekDay tasks={this.state.wednesday} dayName="Wednesday" />
          <WeekDay tasks={this.state.thursday} dayName="Thursday" />
          <WeekDay tasks={this.state.friday} dayName="Friday" />
          <WeekDay tasks={this.state.saturday} dayName="Saturday" />
          <WeekDay tasks={this.state.sunday} dayName="Sunday" />
        </div>
      </div>
    )
  }
}