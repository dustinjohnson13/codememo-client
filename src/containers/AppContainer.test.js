import React from 'react';
import {mapStateToProps} from './AppContainer';
import {REVIEW} from "../actions/pages";
import FakeDataService from "../fakeData/FakeDataService";

describe('<AppContainer />', () => {

    const dataService = new FakeDataService();
    const ownProps = {dataService: dataService};

    it('maps the page to props from state', () => {
        const expectedPage = REVIEW;
        const state = {app: {page: REVIEW}};

        const props = mapStateToProps(state, ownProps);

        expect(props.page).toEqual(expectedPage);
    });

    it('maps the dataService to props from ownProps', () => {
        const state = {app: {page: REVIEW}};

        const props = mapStateToProps(state, ownProps);

        expect(props.dataService).toEqual(dataService);
    });
});