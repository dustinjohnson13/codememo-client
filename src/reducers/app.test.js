//@flow
import app from './app'
import { fetchCollectionRequest, fetchDeckRequest, fetchDeckSuccess, loadPage } from '../actions/creators'
import { Page } from '../actions/pages'
import { DeckResponse } from '../services/APIDomain'

describe('app', () => {
  it('nullifies page while fetching decks', () => {
    const previousState = {page: Page.COLLECTION}
    const expectedState = {page: null}

    const actualState = app(previousState, fetchDeckRequest('deck1'))

    expect(actualState).toEqual(expectedState)
  })

  it('nullifies page while fetching the collection', () => {
    const previousState = {page: Page.COLLECTION}
    const expectedState = {page: null}

    const actualState = app(previousState, fetchCollectionRequest())

    expect(actualState).toEqual(expectedState)
  })

  it('sets page to ReviewPage on fetch deck success', () => {
    const previousState = {page: null}
    const expectedState = {page: Page.REVIEW}

    const actualState = app(previousState, fetchDeckSuccess(new DeckResponse('id', 'name', [])))

    expect(actualState).toEqual(expectedState)
  })

  it('sets page to requested target on load page', () => {
    const previousState = {page: null}
    const expectedState = {page: Page.REVIEW}

    const actualState = app(previousState, loadPage(Page.REVIEW))

    expect(actualState).toEqual(expectedState)
  })
})