//@flow
import { collection, review } from './selectors'
import { defaultState } from '../fakeData/storeFake'
import { collectionState } from '../fakeData/collectionState'
import { reviewState } from '../fakeData/reviewState'

describe('selectors', () => {

  it('returns correct state slice for collection', () => {
    expect(collection(defaultState)).toEqual(collectionState)
  })

  it('returns correct state slice for review', () => {
    expect(review(defaultState)).toEqual(reviewState)
  })
})