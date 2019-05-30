import PlannerEmployeeItemList from './plannerEmployeeItemList'
import { reorder, move, createTask, getDate } from './plannerLogic'
import PlannerDayColumn from './plannerDayColumn'
import { DragDropContext } from 'react-beautiful-dnd'
import ButterToast, { Cinnamon } from 'butter-toast'
import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import { DateTime, Info } from 'luxon'
import axios from 'axios/index'
import uuidv1 from 'uuid/v1'

const cookies = new Cookies()

require('../../stylesheets/planner.sass')

export default class Planner extends Component {
  state = {
    employees: [],
    loadEmployees: false,
    weekId: undefined,
    week: DateTime.local().weekNumber,
    year: DateTime.local().year,
    monday: [], tuesday: [], wednesday: [], thursday: [],
    friday: [], saturday: [], sunday: []
  }

  constructor(props) {
    super(props)
    this.goToPreviousWeek = this.goToPreviousWeek.bind(this)
    this.goToNextWeek = this.goToNextWeek.bind(this)
    this.saveWeek = this.saveWeek.bind(this)
  }

  componentDidMount(){
    axios({
      method: 'get',
      url: 'http://localhost:8090/api/user',
      headers: {
        Authorization: 'Bearer ' + cookies.get('jwt').accessToken
      }
    })
    .then((res) => {
      let newArray = []
      for (let i = 0; i < res.data.length; i++) {
        let user = res.data[i]
        newArray[i] = {
          id: uuidv1(),
          userId: user.id,
          name: user.name,
          role: user.roles[0]
        }
      }
      this.setState({employees: newArray})
      this.setState({loadEmployees: true})
    })
  }

  // loadWeek() {
  //   axios({
  //     method: 'get',
  //     url: `http://localhost:8090/api/planner/week/${this.state.year}/${this.state.week}`
  //   })
  // }

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

  saveWeek() {
    let tasks = []
    this.state.monday.forEach(task => tasks.push(task))
    this.state.tuesday.forEach(task => tasks.push(task))
    this.state.wednesday.forEach(task => tasks.push(task))
    this.state.thursday.forEach(task => tasks.push(task))
    this.state.friday.forEach(task => tasks.push(task))
    this.state.saturday.forEach(task => tasks.push(task))
    this.state.sunday.forEach(task => tasks.push(task))

    let week = {
      weekId: this.state.weekId,
      planningHasBeenFinished: false,
      year: this.state.year,
      weekNumber: this.state.week,
      tasks: tasks
    }

    axios({
      method: 'post',
      url: 'http://localhost:8090/api/planner/week',
      data: week
    }).then(res => {
      this.setState({weekId: res.data.weekId, monday: [], tuesday: [],
        wednesday: [], thursday: [], friday: [], saturday: [], sunday: []})

      res.data.tasks.forEach(task => {
        task.key = uuidv1()

        this.state.employees.forEach(employee => {
          if (task.userId === employee.userId) task.name = employee.name
        })

        // Convert Date strings to Date Objects
        task.beginDateTime = new Date(task.beginDateTime)
        task.endDateTime = new Date(task.endDateTime)

        switch (task.beginDateTime.getDay()) {
          case 1: this.state.monday.push(task); break
          case 2: this.state.tuesday.push(task); break
          case 3: this.state.wednesday.push(task); break
          case 4: this.state.thursday.push(task); break
          case 5: this.state.friday.push(task); break
          case 6: this.state.saturday.push(task); break
          case 0: this.state.sunday.push(task); break
        }
      })

      this.forceUpdate()
    }).catch(error => {
      console.log(error)
    })
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
          <input type='time' id='startTime' />
          <input type='time' id='endTime' />
          <button onClick={this.saveWeek}>Save Week</button>
        </div>
        
        <DragDropContext onDragEnd={this.onDragEnd}>
          {this.state.loadEmployees &&
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
