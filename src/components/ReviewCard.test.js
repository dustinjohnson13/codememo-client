//@flow
import React from 'react'
import { Provider } from 'react-redux'
import { defaultState, storeFake } from '../fakeData/storeFake'
import ReviewCard from './ReviewCard'
import jsdom from 'jsdom'
import { mount } from 'enzyme'
import { initialState } from '../reducers/reviewPage'
import type { ReviewState } from '../actions/actionTypes'
import { Format } from '../persist/Dao'

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.document = doc
global.window = doc.defaultView

describe('<ReviewCard />', () => {

  const prepare = ((state: ReviewState, showingAnswer: boolean) => {

    const combinedState = {
      ...defaultState,
      review: state
    }

    const answer = () => {
    }
    const showAnswer = () => {
    }
    const store = storeFake(combinedState)
    const wrapper = mount(
      <Provider store={store}>
        <ReviewCard question='What is the capital of Peru?' showingAnswer={showingAnswer}
                    showAnswer={showAnswer} answer="Lima" answerCard={answer} cardId='card-1'
                    deckId='deck-1' format={Format.PLAIN}/>
      </Provider>
    )

    return wrapper.find(ReviewCard)
  })

  it('shows the question', () => {
    const collection = prepare(initialState, false).find('.review-question')
    expect(collection.length).toEqual(1)
    expect(collection.text()).toEqual('What is the capital of Peru?')
  })

  it('shows the answer when state requests it', () => {

    const component = prepare(initialState, true)

    const answerSelector = '.review-answer'

    let answer = component.find(answerSelector)
    expect(answer.length).toEqual(1)

    const showAnswer = component.find('.show-answer')
    expect(showAnswer.length).toEqual(0)
  })

  it('hides the answer when state requests it', () => {

    const component = prepare(initialState, false)

    const answerSelector = '.review-answer'

    let answer = component.find(answerSelector)
    expect(answer.length).toEqual(0)

    const showAnswer = component.find('.show-answer')
    expect(showAnswer.length).toEqual(1)
  })
})