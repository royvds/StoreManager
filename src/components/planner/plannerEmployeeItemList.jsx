import React, { Component } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'

const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 ${grid}px 5px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'lightblue',

  // styles we need to apply on draggables
  ...draggableStyle
})

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'rgb(98, 181, 229)' : 'aliceblue',
  display: 'flex',
  padding: grid,
  overflow: 'auto'
})

export default class PlannerEmployeeItemList extends Component {
  render() {
    let {items} = this.props
    return (
      <Droppable droppableId={this.props.droppableId} direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            id='planner-employeelist'
            style={getListStyle(snapshot.isDraggingOver)}
            {...provided.droppableProps}
          >
            {items.map((item, index) => (
              <Draggable key={item.key} draggableId={item.key} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    <div>
                      <p>{item.name}</p>
                      <p>{item.role.name.substr(5)}</p>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    )
  }
}
