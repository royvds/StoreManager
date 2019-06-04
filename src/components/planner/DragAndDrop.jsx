import uuidv1 from 'uuid/v1'
import {DateTime} from 'luxon'
import {getDateTime, getHours, getMinutes, getDayIndex} from './Time'

// reordering the result in an array
export function reorder(list, startIndex, endIndex) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

// Move an item from one list to another
export function move (source, destination, droppableSource, droppableDestination) {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)

  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  const result = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone

  return result
}

export function createTask
(source, destination, droppableSource,
 droppableDestination, year, week, weekId, startTime, endTime)
{
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const day = getDayIndex(droppableDestination.droppableId)
  const beginDateTime = getDateTime(year, week, day, getHours(startTime), getMinutes(startTime))
  const endDateTime = getDateTime(year, week, day, getHours(endTime), getMinutes(endTime))
  const user = sourceClone[droppableSource.index]

  destClone.splice(droppableDestination.index, 0, {
    key: uuidv1(),
    id: null,
    weekId: weekId,
    userId: user.id,
    name: user.name,
    beginDateTime: beginDateTime,
    endDateTime: endDateTime
  })

  const result = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone

  return result
}