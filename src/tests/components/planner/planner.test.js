import React from 'react'
import Planner from '../../../components/planner/Planner'

jest.mock('../../../services/UserService')
jest.mock('../../../services/WeekService')

describe('Planner Component', () => {

    beforeAll(() => {
        const div = document.createElement('div')
        window.domNode = div
        document.body.appendChild(div)
    })

    it('Test if planner header and planner toolbar are rendered', async () => {
        const wrapper = shallow(<Planner />)
        expect(wrapper.exists('#planner-header')).toBe(true)
        expect(wrapper.exists('#planner-toolbar')).toBe(true)
    })

    it('Test if Employees are loaded in', async () => {
        const wrapper = mount(<Planner />, { attachTo: window.domNode })
        await flushPromises()
        wrapper.update()
        expect(wrapper.exists('#planner-employeelist')).toBe(true)
        wrapper.unmount()
    })

    it('Test if Employees are loaded in', async () => {
        const wrapper = mount(<Planner />, { attachTo: window.domNode })
        await flushPromises()
        wrapper.update()
        expect(wrapper.exists('#planner')).toBe(true)
        expect(wrapper.find('#planner').getDOMNode().childNodes.length === 7)
        wrapper.unmount()
    })
})
