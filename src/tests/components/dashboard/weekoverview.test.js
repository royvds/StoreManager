import React from 'react'
import WeekOverview from '../../../components/dashboard/WeekOverview'
import jwt from '../../../services/__mocks__/data/jwt.json'
import Principal from "../../../utils/Principal";

jest.mock('../../../services/TaskService')

describe('WeekOverview Component', () => {

  beforeAll(() => {
    const div = document.createElement('div')
    window.domNode = div
    document.body.appendChild(div)
  })

  it('Test if all three mock data days are loaded in, and other days aren\'t', async () => {
    Principal.setJwt(jwt) // set mock jwt token
    const wrapper = mount(<WeekOverview />, { attachTo: window.domNode })

    await flushPromises()
    wrapper.update()

    expect(wrapper.exists('#overview-monday')).toBe(true)
    expect(wrapper.exists('#overview-wednesday')).toBe(true)
    expect(wrapper.exists('#overview-saturday')).toBe(true)

    expect(wrapper.exists('#overview-tuesday')).toBe(false)
    expect(wrapper.exists('#overview-thursday')).toBe(false)
    expect(wrapper.exists('#overview-friday')).toBe(false)
    expect(wrapper.exists('#overview-sunday')).toBe(false)
    wrapper.unmount()
  })
})
