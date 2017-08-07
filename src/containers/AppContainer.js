import {connect} from 'react-redux'
import App from '../App'
import * as domain from '../Domain'

const clock = new domain.Clock(() => new Date().getTime());

const mapStateToProps = (state, ownProps) => {
    const page = state.app.page;

    return {page: page, clock: clock};
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {}
};

const AppContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default AppContainer