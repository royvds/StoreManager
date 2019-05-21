import React, { Component } from 'react'
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import PlannerDayColumn from '../partial/plannerDayColumn'
import Cookies from 'universal-cookie'
import PlannerEmployeeItemList from '../partial/plannerEmployeeItemList'
import {DateTime, Info} from 'luxon'
import uuidv1 from 'uuid/v1'
import clone from 'clone'
import ButterToast, { Cinnamon } from 'butter-toast';

const cookies = new Cookies()

// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: uuidv1(),
    name: 'Test user',
    startTime: '17:00',
    endTime: '21:00',
  }))

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

// Moves an item from one list to another list.
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)

  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  const result = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone

  return result
}

const copy = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)

  let startTime = document.getElementById('startTime').value
  let endTime = document.getElementById('endTime').value

  destClone.splice(droppableDestination.index, 0, {
    id: uuidv1(),
    content: clone(sourceClone[droppableSource.index].content),
    name: clone(sourceClone[droppableSource.index].name),
    startTime: startTime,
    endTime: endTime
  })

  const result = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone

  return result
}

require('../../stylesheets/planner.sass')

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

    // dropped outside the list
    if (!destination) return

    if (source.droppableId === destination.droppableId) {
      let _state = {}
      _state[source.droppableId] = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      )
      this.setState(_state)
    } else {
      let result
      if (source.droppableId == 'employees') {
        let startTime = document.getElementById('startTime').value
        let endTime = document.getElementById('endTime').value

        console.log (startTime > endTime)

        if (startTime === '' || endTime === '' || startTime > endTime) {
          ButterToast.raise({
            timeout: 5000,
            content: <Cinnamon.Crisp scheme={Cinnamon.Crisp.SCHEME_RED}
                                     content={() => <p>Please make sure you have entered proper times</p>}
                                     title='Task creation failed!'/>
          })
        } else {
          result = copy(
            this.getList(source.droppableId),
            this.getList(destination.droppableId),
            source,
            destination
          )
        }
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
