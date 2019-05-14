import React, { Component } from 'react'
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import PlannerDayColumn from '../partial/plannerDayColumn'
import Cookies from 'universal-cookie'
import PlannerEmployeeItemList from '../partial/plannerEmployeeItemList'

const uuidv1 = require('uuid/v1')
const cookies = new Cookies()
const { DateTime } = require('luxon')
const clone = require('clone');

// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: uuidv1(),
    content:
      (<div>
        <p>Roy van der Steen</p>
        <p>17:00 - 21:00</p>
        <p>{`item-${k + offset}`}</p>
      </div>)
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

  destClone.splice(droppableDestination.index, 0, {
    id: uuidv1(),
    content: clone(sourceClone[droppableSource.index].content)
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
    week: DateTime.fromObject(Date.now()).weekNumber,
    year: DateTime.fromObject(Date.now()).year,
    monday: getItems(10),
    tuesday: getItems(5, 10),
    wednesday: getItems(5, 20),
    thursday: getItems(5, 30),
    friday: getItems(5, 40),
    saturday: getItems(5, 50),
    sunday: getItems(5, 60)
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
          id: `item-${i + 80}`,
          // userId: res.data[i].id,
          content: (
            <div>
              <p>{res.data[i].name}</p>
             <p>{res.data[i].roles[0].name.substr(5)}</p>
            </div>
          )
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
        result = copy(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        )
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
    let employeelist = this.state.employees.map((empl) => {
      return <li>{empl.name}</li>
    })

    return (
      <div className='view-wrapper noselect'>
        <div id='planner-header'>
          <p onClick={this.goToPreviousWeek}>&lt;</p>
          <p>Week {this.state.week}</p>
          <p onClick={this.goToNextWeek}>&gt;</p>
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
