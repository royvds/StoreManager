import React, { Component } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import PlannerDayColumn from '../partial/plannerDayColumn'

// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}`,
    content: `item-${k + offset}`
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

require('../../stylesheets/planner.sass')

export default class Planner extends Component {
  state = {
    updateComponent: false,
    monday: getItems(10),
    tuesday: getItems(5, 10),
    wednesday: getItems(5, 20),
    thursday: getItems(5, 30),
    friday: getItems(5, 40),
    saturday: getItems(5, 50),
    sunday: getItems(5, 60)
  }

  getList = id => this.state[id]

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
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      )

      let _state = {} // update both the source and destination array in state
      for (let key of Object.keys(result)) _state[key] = result[key]
      this.setState(_state)
    }
  }

  render() {
    return (
      <div className='view-wrapper'>
        <div id='planner'>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <PlannerDayColumn droppableId='monday'    items={this.state.monday} />
            <PlannerDayColumn droppableId='tuesday'   items={this.state.tuesday} />
            <PlannerDayColumn droppableId='wednesday' items={this.state.wednesday} />
            <PlannerDayColumn droppableId='thursday'  items={this.state.thursday} />
            <PlannerDayColumn droppableId='friday'    items={this.state.friday} />
            <PlannerDayColumn droppableId='saturday'  items={this.state.saturday} />
            <PlannerDayColumn droppableId='sunday'    items={this.state.sunday} />
          </DragDropContext>
        </div>
      </div>
    )
  }
}
