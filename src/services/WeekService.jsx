import ButterToast, {Cinnamon} from 'butter-toast'
import {DateTime, Info} from 'luxon'
import Cookies from 'universal-cookie'
import axios from 'axios/index'
import uuidv1 from 'uuid/v1'
import React from 'react'

require("babel-polyfill")

const cookies = new Cookies()

export default class WeekService {
  async getWeek(year, week) {



    // try {
    //   const response = await axios({
    //     method: 'get',
    //     url: `http://localhost:8090/api/planner/week/${year}/${week}/`,
    //     headers: {
    //       Authorization: 'Bearer ' + cookies.get('jwt').accessToken
    //     }
    //   })
    //
    //   return this.prepareWeek(response.data)
    // } catch (e) {
    //   ButterToast.raise({
    //     timeout: 5000,
    //     content: <Cinnamon.Crisp scheme={Cinnamon.Crisp.SCHEME_RED}
    //                              content={() => <p>There might be a connection error, please try again later.</p>}
    //                              title='Could not retrieve week data!'/>
    //   })
    // }
  }

  async saveWeek(week) {
    try {
      const response = await axios({
        method: 'post',
        url: 'http://localhost:8090/api/planner/week',
        data: week,
        headers: {
          Authorization: 'Bearer ' + cookies.get('jwt').accessToken
        }
      })

      return this.prepareWeek(response.data)
    } catch (e) {
      ButterToast.raise({
        timeout: 5000,
        content: <Cinnamon.Crisp scheme={Cinnamon.Crisp.SCHEME_RED}
                                 content={() => <p>There might be a connection error, please try again later</p>}
                                 title='Could not save week!'/>
      })
    }
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