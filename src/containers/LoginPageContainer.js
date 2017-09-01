//@flow
import { connect } from 'react-redux'
import { loginRequest } from '../actions/creators'
import type { CombinedState, Dispatch } from '../actions/actionTypes'
import LoginPage from '../components/LoginPage'

type OwnProps = {}

export const mapStateToProps = (state: CombinedState, ownProps: OwnProps) => {
  return state
}

export const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps) => {

  return {
    login: (username: string, password: string) => {
      dispatch(loginRequest(username, password))
    }
  }
}

const LoginPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage)

export default LoginPageContainer