// a little function to help us with reordering the result in an array
import uuidv1 from 'uuid/v1'
import clone from 'clone'

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

// Moves an item from one list to another list.
export const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)

  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  const result = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone

  return result
}

export const createTask = (source, destination, droppableSource, droppableDestination) => {
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