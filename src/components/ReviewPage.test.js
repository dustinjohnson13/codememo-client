//@flow
import React from 'react'
import { Provider } from 'react-redux'
import { storeFake } from '../fakeData/storeFake'
import ReviewPage from './ReviewPage'
import jsdom from 'jsdom'
import { mount } from 'enzyme'

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.document = doc
global.window = doc.defaultView

describe('<ReviewPage />', () => {

  let component
  let requested = []
  const back = () => {
    requested.push('back')
  }
  const restartTimer = () => {
    requested.push('restartTimer')
  }
  const showAnswer = () => {
    requested.push('showAnswer')
  }
  const answerCard = () => {
    requested.push('answerCard')
  }
  const addCard = () => {
    requested.push('addCard')
  }

  beforeEach(() => {
    requested = []

    const store = storeFake()
    const wrapper = mount(
      <Provider store={store}>
        <ReviewPage deckName={'SomeDeck'} totalCount={30} dueCount={20} newCount={10} back={back}
                    id='deck1' question='q1' answer='a1' answerCard={answerCard} addCard={addCard}
                    showAnswer={showAnswer} restartTimer={restartTimer}/>
      </Provider>
    )

    component = wrapper.find(ReviewPage)
  })

  it('shows the deck name', () => {
    expect(component.contains(<h3>SomeDeck</h3>)).toEqual(true)
  })

  it('should be able to go back', () => {
    const backBtn = component.find('.back').simulate('click')
    expect(requested).toEqual(['back'])
  })

  it('shows the card counts', () => {
    // TODO: How to verify these?
    // expect(component.contains(<span className="due-count">20</span>)).toEqual(true);
    // expect(component.contains(<span className="new-count">10</span>)).toEqual(true);
  })
})