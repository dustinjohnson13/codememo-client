//@flow
import React, {Component} from 'react'
import '../styles/App.css'
import LoadingPage from './LoadingPage'
import CollectionPageContainer from '../containers/CollectionPageContainer'
import LoginPageContainer from '../containers/LoginPageContainer'
import ReviewPageContainer from '../containers/ReviewPageContainer'
import type {PageType} from "../actions/pages"
import {Page} from "../actions/pages"

type Props = {
    +page?: PageType,
    +nospin: boolean
}

class App extends Component<Props, void> {
    render() {
        const requestedPage = this.props.page
        let page = <LoadingPage nospin={this.props.nospin}/>

        switch (requestedPage) {
            case Page.LOGIN:
                page = <LoginPageContainer/>
                break;
            case Page.COLLECTION:
                page = <CollectionPageContainer/>
                break
            case Page.REVIEW:
                page = <ReviewPageContainer/>
                break
            default:
        }

        return (
            <div className="App">
                <div className="App-header">
                    <h2>CodeMemo</h2>
                </div>
                {page}
            </div>
        )
    }
}

export default App
