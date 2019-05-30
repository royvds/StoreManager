import uuidv1 from 'uuid/v1'
import {DateTime} from 'luxon'

// a little function to help us with reordering the result in an array
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

function getDateTime(year, week, day, hour, minute) {
  let date = new Date(DateTime.fromObject(
    {weekYear: year, weekNumber: week, weekday: day}).toString())
  date.setHours(hour)
  date.setMinutes(minute)
  return date
}

function getHours (time) {return parseInt(time.substr(0,2))}
function getMinutes (time) {return parseInt(time.substr(3,5))}

export const createTask =
  (source, destination, droppableSource, droppableDestination, year, week, weekId) => {

  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)

  let startTime = document.getElementById('startTime').value
  let endTime = document.getElementById('endTime').value

  let day
  switch(droppableDestination.droppableId) {
    case 'monday': day = 1; break
    case 'tuesday': day = 2; break
    case 'wednesday': day = 3; break
    case 'thursday': day = 4; break
    case 'friday': day = 5; break
    case 'saturday': day = 6; break
    case 'sunday': day = 7; break
  }

  let beginDateTime = getDateTime(year, week, day, getHours(startTime), getMinutes(startTime))
  let endDateTime = getDateTime(year, week, day, getHours(endTime), getMinutes(endTime))

  let user = sourceClone[droppableSource.index]

  destClone.splice(droppableDestination.index, 0, {
    key: uuidv1(),
    id: null,
    weekId: weekId,
    userId: user.userId,
    name: user.name,
    beginDateTime: beginDateTime,
    endDateTime: endDateTime
  })

  const result = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone

  return result
}

// noinspection JSMethodCanBeStatic
export const getDate = (year, week, day) => {
  if (day < 1 || day > 7 || day.isNaN) return
  return DateTime.fromObject({ weekYear: year, weekNumber: week, weekday: day })
}