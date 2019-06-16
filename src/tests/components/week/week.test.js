import React from 'react'
import Week from "../../../components/week/Week";

jest.mock('../../../services/UserService')
jest.mock('../../../services/WeekService')

describe('Week Component', () => {

  beforeAll(() => {
    const div = document.createElement('div')
    window.domNode = div
    document.body.appendChild(div)
  })

  it('Test if planner header and planner toolbar are rendered', async () => {
    const wrapper = shallow(<Week />)
    expect(wrapper.exists('#overview-header')).toBe(true)
  })

  it('Test if Employees are loaded in', async () => {
    const wrapper = mount(<Week />, { attachTo: window.domNode })
    await flushPromises()
    wrapper.update()
    expect(wrapper.exists('.comp-week-day')).toBe(true)
    wrapper.unmount()
  })
})
