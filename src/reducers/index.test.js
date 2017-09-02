//@flow
import codeMemo from './index'
import { fetchCollectionSuccess, loginPage, startTimer } from '../actions/creators'
import { defaultState } from '../fakeData/storeFake'
import { CollectionResponse } from '../services/APIDomain'

describe('codeMemo', () => {

  it('composes review page reducer', () => {
    const timerStarted = codeMemo(defaultState, startTimer())
    expect(timerStarted.review.startTime).toBeGreaterThan(0)
  })

  it('composes collection page reducer', () => {
    const actualState = codeMemo(defaultState, fetchCollectionSuccess(new CollectionResponse([])))
    expect(actualState.collection.decks).toEqual([])
  })

  it('composes app reducer', () => {
    const action = loginPage()
    const actualState = codeMemo(defaultState, action)
    expect(actualState.app.page).toEqual(action.page)
  })
})