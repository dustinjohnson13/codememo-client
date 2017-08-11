//@flow
import React from 'react';
import {mapStateToProps} from './AppContainer';
import {Page} from "../actions/pages";
import {FakeDataService} from "../fakeData/FakeDataService";

describe('<AppContainer />', () => {

    const dataService = new FakeDataService();
    const ownProps = {dataService: dataService};

    it('maps the page to props from state', () => {
        const expectedPage = Page.REVIEW;
        const state = {app: {page: Page.REVIEW}};

        const props = mapStateToProps(state, ownProps);

        expect(props.page).toEqual(expectedPage);
    });

    it('maps the dataService to props from ownProps', () => {
        const state = {app: {page: Page.REVIEW}};

        const props = mapStateToProps(state, ownProps);

        expect(props.dataService).toEqual(dataService);
    });
});