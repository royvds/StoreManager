import {DateTime, Info} from 'luxon'
import Cookies from 'universal-cookie'
import uuidv1 from 'uuid/v1'
import React from 'react'

require("babel-polyfill")

const cookies = new Cookies()

export default class WeekService {
    async getWeek(year, week) {
        let output = this.prepareWeek({
            weekId: 1,
            planningHasBeenFinished: false,
            year: year,
            weekNumber: week,
            tasks: null
        })

        return new Promise(resolve => resolve(output))
    }

    async saveWeek(week) {
        let output = this.prepareWeek({
            weekId: 1,
            planningHasBeenFinished: false,
            year: week.year,
            weekNumber: week.weekNumber,
            tasks: week.tasks
        })

        return new Promise(resolve => resolve(output))
    }

    prepareWeek(weekResponse) {
        Info.weekdays().forEach(day => weekResponse[day.toLowerCase()] = [])

        if (weekResponse.tasks != null) {
            weekResponse.tasks.forEach(task => {
                task.key = uuidv1()

                // Convert Date strings to Date Objects
                task.beginDateTime = new Date(task.beginDateTime)
                task.endDateTime = new Date(task.endDateTime)

                let index = task.beginDateTime.getDay()
                weekResponse[Info.weekdays()[index == 0 ? 6 : index-1].toLowerCase()].push(task)
            })
        }

        // The tasks have now been sorted into days so we can safely delete them
        delete weekResponse['tasks']
        return weekResponse
    }
}