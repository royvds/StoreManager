import { shallow, mount, render } from 'enzyme'
import React from 'react'
import Login from '../../../components/login/Login'
import Cookies from 'universal-cookie'
const cookies = new Cookies()

require("babel-polyfill")

describe('Login Component', () => {

  beforeAll(() => {
    const div = document.createElement('div')
    window.domNode = div
    document.body.appendChild(div)
  })

  it('Test login by jwt cookie, also tests if login is faster than 2 seconds', async () => {
    const wrapper = mount(<Login />, { attachTo: window.domNode })
    const mailInput = wrapper.find('#loginForm-email')
    const passwordInput = wrapper.find('#loginForm-password')
    const submitButton = wrapper.find('#loginForm-submit')

    cookies.remove('jwt')

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
      expect(cookies.get('jwt').accessToken)
    })
  })

})
