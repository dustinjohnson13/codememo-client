import {connect} from 'react-redux'
import App from '../components/App'

export const mapStateToProps = (state, ownProps) => {
    const page = state.app.page;

    return {page: page};
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {}
};

const AppContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default AppContainer