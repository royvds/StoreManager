import {Info} from 'luxon'

export function processWeek(week, employees) {
  if (week == null) return null
  Info.weekdays().forEach(day => {
    week[day.toLowerCase()].forEach(task => {
      employees.forEach(employee => {
        if (task.userId == employee.id) task.name = employee.name
      })
    })
  })
  return week
}