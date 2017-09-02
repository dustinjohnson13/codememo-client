//@flow
import React from 'react'
import { Provider } from 'react-redux'

import LoginPage from './LoginPage'
import { defaultState, storeFake } from '../fakeData/storeFake'
import { mount } from 'enzyme'
import jsdom from 'jsdom'

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.document = doc
global.window = doc.defaultView

describe('<LoginPage />', () => {

  let wrapper
  let actions = []

  const login = (email: string, password: string) => {
    actions.push('login')
  }

  beforeEach(function () {
    actions = []

    const store = storeFake(defaultState)
    wrapper = mount(
      <Provider store={store}>
        <LoginPage login={login}/>
      </Provider>
    )
  })

  it('users can login', () => {
    wrapper.find('#login').simulate('click')

    expect(actions).toEqual(['login'])
  })
})