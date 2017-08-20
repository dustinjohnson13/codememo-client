//@flow
import React from 'react'
import {mapStateToProps} from './AppContainer'
import {Page} from "../actions/pages"

jest.mock('../services/API') // Set mock API for module importing

describe('<AppContainer />', () => {

    const ownProps = {}

    it('maps the page to props from state', () => {
        const expectedPage = Page.REVIEW
        const state = {app: {page: Page.REVIEW}}

        const props = mapStateToProps(state, ownProps)

        expect(props.page).toEqual(expectedPage)
    })
})