//@flow
import React from 'react'
import { mapDispatchToProps, mapStateToProps } from './AppContainer'
import { Page } from '../actions/pages'
import { defaultState } from '../fakeData/storeFake'
import { appState } from '../fakeData/appState'

jest.mock('../services/API') // Set mock API for module importing

describe('<AppContainer />', () => {

  const ownProps = {}

  it('maps the page to props from state', () => {
    const expectedPage = Page.REVIEW
    const state = {
      ...defaultState,
      app: {...appState, page: Page.REVIEW}
    }

    const props = mapStateToProps(state, ownProps)

    expect(props.page).toEqual(expectedPage)
  })

  it('maps dispatch to props', () => {
    const expectedProps = {}

    const actual = mapDispatchToProps(action => {}, ownProps)

    expect(actual).toEqual(expectedProps)
  })
})