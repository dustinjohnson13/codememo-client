import jsdom from 'jsdom';
import React from 'react';
import {Provider} from 'react-redux';
import {mount} from 'enzyme';
import App from "./App";
import {storeFake} from "../fakeData/storeFake";

import LoadingPage from "../components/LoadingPage";
import {COLLECTION, REVIEW} from "../actions/pages";
import ReviewPageContainer from "../containers/ReviewPageContainer";
import CollectionPageContainer from "../containers/CollectionPageContainer";
import {collectionState} from "../fakeData/collectionState";
import {reviewState} from "../fakeData/reviewState";
import FakeDataService from "../fakeData/FakeDataService";

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;

describe('<App />', () => {

    const dataService = new FakeDataService();

    const prepareContainer = (page, state = {}) => {
        const store = storeFake(state);

        const wrapper = mount(
            <Provider store={store}>
                <App dataService={dataService} page={page} nospin={true}/>
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

        const app = prepareContainer(REVIEW, {review: reviewState});

        const reviewPage = <ReviewPageContainer dataService={dataService}/>;
        expect(app.contains(reviewPage)).toEqual(true);
    });

    it('displays the collection page when specified', () => {
        const app = prepareContainer(COLLECTION, {collection: collectionState});

        const expected = <CollectionPageContainer dataService={dataService}/>;
        expect(app.contains(expected)).toEqual(true);
    });
});