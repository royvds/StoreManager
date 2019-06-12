import { shallow, mount, render } from 'enzyme'
import jwt from '../../../services/__mocks__/data/jwt.json'
import React from 'react'
import Navbar from '../../../components/navigation/Navbar'
import Cookies from 'universal-cookie'
import ReactRouterEnzymeContext from "react-router-enzyme-context"
const cookies = new Cookies()

require("babel-polyfill")

describe('Login Component', () => {

    it('Test if navigation has links when authenticated and no links when not', async () => {

        const mockRouter = new ReactRouterEnzymeContext()

        const wrapper = shallow(<Navbar.WrappedComponent {...mockRouter.props()}/>)

        expect(wrapper.exists('#navLinks')).toBe(false)
        cookies.set('jwt', jwt)
        mockRouter.props().history.go('/')
        expect(wrapper.exists('#navLinks')).toBe(true)
    })
})
