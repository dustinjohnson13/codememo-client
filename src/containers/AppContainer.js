//@flow
import { connect } from 'react-redux'
import App from '../components/App'
import type { CombinedState } from '../actions/actionTypes'

export const mapStateToProps = (state: CombinedState, ownProps: {}) => {
  const page = state.app.page

  return {page: page}
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: {}) => {
  return {}
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default AppContainer