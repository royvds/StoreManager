import React, { Component } from 'react'
import {Link} from "react-router-dom"
import {DateTime} from "luxon"
import WeekOverview from "./WeekOverview"
import Principal from '../../utils/Principal'
import Notifications from './Notifications'

require('./Dashboard.sass')
require("babel-polyfill")


export default class Dashboard extends Component {
  state = {
    year: DateTime.local().year,
    week: DateTime.local().weekNumber
  }

  render() {
    return (
      <div className='view-wrapper' id='comp-dashboard'>
        <div id='dashboard-header'>
          <Notifications />
          <WeekOverview year={this.state.year} week={this.state.week} userId={Principal.getId()} />
        </div>

        <div id='pages'>
          <Link to='/planner'>
            <h3>Planner</h3>
            <p>Make a planning for the coming weeks</p>
          </Link>
          <Link to='/week'>
            <h3>Week Overview</h3>
            <p>See when you have to work</p>
          </Link>
        </div>
      </div>
    )
  }
}
