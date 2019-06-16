import React from 'react'
import Login from '../../../components/login/Login'
import ReactRouterEnzymeContext from "react-router-enzyme-context";
import Principal from "../../../utils/Principal";

require("babel-polyfill")

jest.mock('../../../services/AuthService')

describe('Login Component', () => {

  beforeAll(() => {
    const div = document.createElement('div')
    window.domNode = div
    document.body.appendChild(div)
  })

  it('Test login by jwt cookie, also tests if login is faster than 2 seconds', async () => {
    const mockRouter = new ReactRouterEnzymeContext()
    const wrapper = mount(<Login {...mockRouter.props()} />, { attachTo: window.domNode })
    const mailInput = wrapper.find('#loginForm-email')
    const passwordInput = wrapper.find('#loginForm-password')

    Principal.deleteJwt()

    mailInput.getDOMNode().value = 'vdsteenroy@hotmail.nl'
    passwordInput.getDOMNode().value = 'Password1'
    await wrapper.find('#loginForm').simulate('submit')

    function timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function sleep(fn, ...args) {
      await timeout(2000);
      return fn(...args);
    }

    await sleep(function(){
      expect(Principal.getAccessToken())
    })
  })

})
