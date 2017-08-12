//@flow
import React from 'react';
import {mapStateToProps} from './AppContainer';
import {Page} from "../actions/pages";
import {FakeDataService} from "../fakeData/FakeDataService";
import * as API from '../services/API';
jest.mock('../services/API'); // Set mock API for module importing

describe('<AppContainer />', () => {

    const dataService = API.default;
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