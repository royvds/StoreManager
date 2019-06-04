import {DateTime} from 'luxon'

export function getDateTime (year, week, day, hour, minute) {
  let date = new Date(DateTime.fromObject(
    {weekYear: year, weekNumber: week, weekday: day}).toString())
  date.setHours(hour)
  date.setMinutes(minute)
  return date
}

export function getHours (time) {return parseInt(time.substr(0,2))}
export function getMinutes (time) {return parseInt(time.substr(3,5))}

export function getTimeFromDate (date) {
  let hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
  let minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
  return hours + ":" + minutes
}

export function getDate (year, week, day) {
  if (day < 1 || day > 7 || day.isNaN) return
  return DateTime.fromObject({ weekYear: year, weekNumber: week, weekday: day })
}

export function getDayIndex(day) {
  switch(day.toLowerCase()) {
    case 'monday':    return 1
    case 'tuesday':   return 2
    case 'wednesday': return 3
    case 'thursday':  return 4
    case 'friday':    return 5
    case 'saturday':  return 6
    case 'sunday':    return 7
  }
}