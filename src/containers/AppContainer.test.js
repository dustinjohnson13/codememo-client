import React from 'react';
import {Provider} from 'react-redux';
import AppContainer from './AppContainer';
import {mount} from 'enzyme';
import App from "../components/App";
import {storeFake} from "../fakeData/storeFake";

import jsdom from 'jsdom';
import LoadingPage from "../components/LoadingPage";
import {COLLECTION, REVIEW} from "../actions/pages";
import ReviewPageContainer from "./ReviewPageContainer";
import CollectionPageContainer from "./CollectionPageContainer";
import {collectionState} from "../fakeData/collectionState";
import {reviewState} from "../fakeData/reviewState";
import FakeDataService from "../fakeData/FakeDataService";

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;

describe('<AppContainer />', () => {

    const dataService = new FakeDataService();

    const prepareContainer = (state) => {
        const store = storeFake(state);

        const wrapper = mount(
            <Provider store={store}>
                <AppContainer dataService={dataService}/>
            </Provider>
        );

        const container = wrapper.find(AppContainer);
        const app = container.find(App);

        return app;
    };

    it('displays the application name', () => {
        const app = prepareContainer({app: {}});

        const welcome = <h2>Flashcard App</h2>;

        expect(app.contains(welcome)).toEqual(true);
    });

    it('displays the loading page when no page is specified', () => {
        const app = prepareContainer({app: {}});

        const loadingPage = <LoadingPage/>;

        expect(app.contains(loadingPage)).toEqual(true);
    });

    it('displays the review page when specified', () => {
        const app = prepareContainer({app: {page: REVIEW}, review: reviewState});

        const reviewPage = <ReviewPageContainer/>;
        expect(app.contains(reviewPage)).toEqual(true);
    });

    it('displays the collection page when specified', () => {
        const state = {app: {page: COLLECTION}, collection: collectionState};
        const app = prepareContainer(state);

        const expected = <CollectionPageContainer dataService={dataService}/>;
        expect(app.contains(expected)).toEqual(true);
    });
});