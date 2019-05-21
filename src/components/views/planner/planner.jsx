import { DragDropContext } from 'react-beautiful-dnd'
import PlannerEmployeeItemList from '../../partial/plannerEmployeeItemList'
import PlannerDayColumn from '../../partial/plannerDayColumn'
import { reorder, move, createTask } from './plannerLogic'
import ButterToast, { Cinnamon } from 'butter-toast'
import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import { DateTime, Info } from 'luxon'
import axios from 'axios/index';
import uuidv1 from 'uuid/v1'

const cookies = new Cookies()

require('../../../stylesheets/planner.sass')

export default class Planner extends Component {
  state = {
    employees: [],
    loadEmployees: false,
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
        newArray[i] = {
          id: uuidv1(),
          name: res.data[i].name,
          role: res.data[i].roles[0]
        }
      }
      this.setState({employees: newArray})
      this.setState({loadEmployees: true})
    })
  }

  getList = id => this.state[id]

  // noinspection JSMethodCanBeStatic
  getDate(year, week, day) {
    if (day < 1 || day > 7 || day.isNaN) return
    return DateTime.fromObject({ weekYear: year, weekNumber: week, weekday: day })
  }

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
          destination
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
        </div>
        
        <DragDropContext onDragEnd={this.onDragEnd}>
          {this.state.loadEmployees &&
            <PlannerEmployeeItemList droppableId='employees' items={this.state.employees} />
          }

          <div id='planner'>
            <PlannerDayColumn droppableId='monday'    items={this.state.monday}     date={this.getDate(this.state.year, this.state.week, 1)} />
            <PlannerDayColumn droppableId='tuesday'   items={this.state.tuesday}    date={this.getDate(this.state.year, this.state.week, 2)} />
            <PlannerDayColumn droppableId='wednesday' items={this.state.wednesday}  date={this.getDate(this.state.year, this.state.week, 3)} />
            <PlannerDayColumn droppableId='thursday'  items={this.state.thursday}   date={this.getDate(this.state.year, this.state.week, 4)} />
            <PlannerDayColumn droppableId='friday'    items={this.state.friday}     date={this.getDate(this.state.year, this.state.week, 5)} />
            <PlannerDayColumn droppableId='saturday'  items={this.state.saturday}   date={this.getDate(this.state.year, this.state.week, 6)} />
            <PlannerDayColumn droppableId='sunday'    items={this.state.sunday}     date={this.getDate(this.state.year, this.state.week, 7)} />
          </div>
        </DragDropContext>

      </div>
    )
  }
}
