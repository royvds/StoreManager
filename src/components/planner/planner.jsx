import PlannerEmployeeItemList from './plannerEmployeeItemList'
import { reorder, move, createTask, getDate } from './plannerLogic'
import PlannerDayColumn from './plannerDayColumn'
import {DragDropContext} from 'react-beautiful-dnd'
import ButterToast, { Cinnamon } from 'butter-toast'
import React, { Component } from 'react'
import { DateTime, Info } from 'luxon'
import UserDao from './userDao'
import WeekDao from './weekDao'

const userDao = new UserDao()
const weekDao = new WeekDao()

require('../../stylesheets/planner.sass')

export default class Planner extends Component {
  state = {
    employees: [],
    weekId: undefined,
    week: DateTime.local().weekNumber,
    year: DateTime.local().year,
    planningHasBeenFinished: false,
    monday: [], tuesday: [], wednesday: [], thursday: [],
    friday: [], saturday: [], sunday: []
  }

  constructor(props) {
    super(props)
    this.goToPreviousWeek = this.goToPreviousWeek.bind(this)
    this.goToNextWeek = this.goToNextWeek.bind(this)
    this.saveWeek = this.saveWeek.bind(this)
  }

  async componentDidMount(){
    this.setState({employees: await userDao.getUsers()})
    this.viewWeek(await this.getWeek())
  }

  async componentDidUpdate(prevProps, prevState) {
    //TODO: Cancel week retrieval request when another request is sent
    // Because else you can get a loop of data retrieval (getWeek changes state, another request
    // that was going on (async) also updates state and now the state keeps changing because the week is
    // different all the time
    if (this.state.week != prevState.week || this.state.year != prevState.year){
      this.viewWeek(await this.getWeek())
    }
  }

  getList = id => this.state[id]
  onDragEnd = result => {
    const { source, destination } = result
    if (!destination) return

    if (source.droppableId === destination.droppableId) {
      let _state = {}
      _state[source.droppableId] = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      )
      this.setState(_state)
    }
    else if (source.droppableId == 'employees') {
      let startTime = document.getElementById('startTime').value
      let endTime = document.getElementById('endTime').value

      if (startTime === '' || endTime === '' || startTime > endTime) {
        ButterToast.raise({
          timeout: 5000,
          content: <Cinnamon.Crisp scheme={Cinnamon.Crisp.SCHEME_RED}
                                   content={() => <p>Please make sure you have entered proper times</p>}
                                   title='Task creation failed!'/>
        })
      } else {
        result = createTask(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination,
          this.state.year,
          this.state.week,
          this.state.weekId
        )
      }
    }
    else if (destination.droppableId == 'employees' &&
      source.droppableId !== destination.droppableId) {
      ButterToast.raise({
        timeout: 5000,
        content: <Cinnamon.Crisp scheme={Cinnamon.Crisp.SCHEME_RED}
                                 content={() => <p>You can't place a task there</p>}
                                 title='You cannot do that!'/>
      })
    }
    else {
      result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      )
    }
    let _state = {} // update both the source and destination array in state
    for (let key of Object.keys(result)) _state[key] = result[key]
    this.setState(_state)
  }

  goToPreviousWeek() { this.setState({week: this.state.week - 1}) }
  goToNextWeek() { this.setState({week: this.state.week + 1}) }

  mergeTasks() {
    let tasks = []
    Info.weekdays().forEach(day => {
      this.state[day.toLowerCase()].forEach(task => tasks.push(task))
      this.state[day.toLowerCase()] = []
    })
    return tasks
  }

  async getWeek() {
    return this.processWeek(await weekDao.getWeek(this.state.year, this.state.week))
  }

  async saveWeek() {
    let tasks = this.mergeTasks()

    let savedWeek = await weekDao.saveWeek({
      weekId: this.state.weekId,
      planningHasBeenFinished: this.state.planningHasBeenFinished,
      year: this.state.year,
      weekNumber: this.state.week,
      tasks: tasks
    })

    if (savedWeek == null) return
    this.processWeek(savedWeek)
    this.viewWeek(savedWeek)
  }

  viewWeek(week) {
    Info.weekdays().forEach(day => this.state[day.toLowerCase()] = week[day.toLowerCase()])
    this.setState({weekId: week.weekId, week: week.weekNumber, year: week.year})
  }

  processWeek(week) {
    if (week == null) return null
    Info.weekdays().forEach(day => {
      week[day.toLowerCase()].forEach(task => {
        this.state.employees.forEach(employee => {
          if (task.userId == employee.id) task.name = employee.name
        })
      })
    })
    return week
  }

  render() {
    return (
      <div className='view-wrapper noselect'>
        <div id='planner-header'>
          <p onClick={this.goToPreviousWeek}>&lt;</p>
          <p>Week {this.state.week}</p>
          <p onClick={this.goToNextWeek}>&gt;</p>
        </div>

        <div id='planner-toolbar'>
          <input type='time' id='startTime' value='09:00' />
          <input type='time' id='endTime' value='10:00' />
          <button onClick={this.saveWeek}>Save Week</button>
        </div>
        
        <DragDropContext onDragEnd={this.onDragEnd}>
          {this.state.employees != null && this.state.employees.length > 0 &&
            <PlannerEmployeeItemList droppableId='employees' items={this.state.employees} />
          }

          <div id='planner'>
            <PlannerDayColumn droppableId='monday'    items={this.state.monday}     date={getDate(this.state.year, this.state.week, 1)} />
            <PlannerDayColumn droppableId='tuesday'   items={this.state.tuesday}    date={getDate(this.state.year, this.state.week, 2)} />
            <PlannerDayColumn droppableId='wednesday' items={this.state.wednesday}  date={getDate(this.state.year, this.state.week, 3)} />
            <PlannerDayColumn droppableId='thursday'  items={this.state.thursday}   date={getDate(this.state.year, this.state.week, 4)} />
            <PlannerDayColumn droppableId='friday'    items={this.state.friday}     date={getDate(this.state.year, this.state.week, 5)} />
            <PlannerDayColumn droppableId='saturday'  items={this.state.saturday}   date={getDate(this.state.year, this.state.week, 6)} />
            <PlannerDayColumn droppableId='sunday'    items={this.state.sunday}     date={getDate(this.state.year, this.state.week, 7)} />
          </div>
        </DragDropContext>

      </div>
    )
  }
}
