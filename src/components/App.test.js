//@flow
import jsdom from 'jsdom';
import React from 'react';
import {Provider} from 'react-redux';
import {mount} from 'enzyme';
import App from "./App";
import {defaultState, storeFake} from "../fakeData/storeFake";

import LoadingPage from "../components/LoadingPage";
import type {PageType} from "../actions/pages";
import {Page} from "../actions/pages";
import ReviewPageContainer from "../containers/ReviewPageContainer";
import {reviewState} from "../fakeData/reviewState";
jest.mock('../services/API'); // Set mock API for module importing

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;

describe('<App />', () => {

    const prepareContainer = (page: ?PageType, state = defaultState) => {
        const store = storeFake(state);

        const wrapper = mount(
            <Provider store={store}>
                <App page={page} nospin={true}/>
            </Provider>
        );

        return wrapper.find(App);
    };

    it('displays the application name', () => {
        const app = prepareContainer(null);

        const welcome = <h2>Flashcard App</h2>;

        expect(app.contains(welcome)).toEqual(true);
    });

    it('displays the loading page when null page is specified', () => {
        const app = prepareContainer(null);

        const loadingPage = <LoadingPage nospin={true}/>;

        expect(app.contains(loadingPage)).toEqual(true);
    });

    it('displays the loading page when undefined page is specified', () => {
        const app = prepareContainer(undefined);

        const loadingPage = <LoadingPage nospin={true}/>;

        expect(app.contains(loadingPage)).toEqual(true);
    });

    it('displays the review page when specified', () => {

        const app = prepareContainer(Page.REVIEW, {...defaultState, review: reviewState});

        const reviewPage = <ReviewPageContainer/>;
        expect(app.contains(reviewPage)).toEqual(true);
    });

    // it('displays the collection page when specified', () => {
    //     const app = prepareContainer(Page.COLLECTION, {...defaultState, collection: collectionState});
    //
    //     const expected = <CollectionPageContainer/>;
    //     expect(app.contains(expected)).toEqual(true);
    // });
});