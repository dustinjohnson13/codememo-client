//@flow
import React from 'react'
import { mapDispatchToProps, mapStateToProps } from './LoginPageContainer'
import { loginRequest } from '../actions/creators'
import { defaultState } from '../fakeData/storeFake'

describe('<LoginPageContainer />', () => {

  let actions = []
  const invoke = (action) => {
    actions.push(action)
  }

  beforeEach(function () {
    actions = []
  })

  it('maps state correctly', () => {
    const props = mapStateToProps(defaultState, {})

    expect(props).toEqual({})
  })

  it('maps login to the appropriate action', () => {

    const username = 'someguy'
    const password = 'somepassword'
    const expectedActions = [loginRequest(username, password)]

    const {login} = mapDispatchToProps(invoke, {})
    login(username, password)

    expect(actions).toEqual(expectedActions)
  })

})