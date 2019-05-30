import React, { Component } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'

const { DateTime } = require('luxon')
const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'lightblue',

  // styles we need to apply on draggables
  ...draggableStyle
})

function getTime (date) {
  let hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
  let minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
  return hours + ":" + minutes
}

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'rgb(98, 181, 229)' : 'transparent',
  padding: grid,
  width: 220
})

export default class PlannerDayColumn extends Component {
  constructor(props) {
    super(props)
    this.updateTitleColor = this.updateTitleColor.bind(this)
  }

  componentDidMount() {
    this.updateTitleColor()
  }

  componentDidUpdate() {
    this.updateTitleColor()
  }

  updateTitleColor() {
    let now = new Date() // Set color of name of day to blue if that date is today
    if (DateTime.fromObject(now).toFormat('yyyy LLL dd') === this.props.date.toFormat('yyyy LLL dd')) {
      document.getElementById(`dayColumn-${this.props.date.toFormat('yyyy-LL-dd')}`)
        .childNodes[0].style.color = 'blue'
    } else {
      document.getElementById(`dayColumn-${this.props.date.toFormat('yyyy-LL-dd')}`)
        .childNodes[0].style.color = 'black'
    }
  }

  render() {
    return (
      <div id={`dayColumn-${this.props.date.toFormat('yyyy-LL-dd')}`}>
        <h3>{this.props.date.weekdayLong} {this.props.date.toFormat('dd/LL')}</h3>
          <Droppable droppableId={this.props.droppableId}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}>
                  {this.props.items.map((item, index) => (
                    <Draggable
                      key={item.key}
                      draggableId={item.key}
                      index={index}>
                        {(provided, snapshot) => (
                          <div
                            key={item.key}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}>
                              <div>
                                <p>{item.name}</p>
                                <p>{getTime(item.beginDateTime)} - {getTime(item.endDateTime)}</p>
                              </div>
                          </div>
                        )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )
    }
}
