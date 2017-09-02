//@flow
import React, { Component } from 'react'
import { Button, Col, Container, Input, InputGroup, Row } from 'reactstrap'
import '../styles/LoginPage.css'

type Props = {
  +login: (email: string, password: string) => void,
}

type State = {
  email: string;
  password: string;
}

class LoginPage extends Component<Props, State> {
  state: State
  handleEmailChange = (event: SyntheticInputEvent<Input>) => {
    this.setState({email: event.target.value})
  }
  handlePasswordChange = (event: SyntheticInputEvent<Input>) => {
    this.setState({password: event.target.value})
  }
  login = () => {
    this.props.login(this.state.email, this.state.password)
  }

  constructor (props: Props) {
    super(props)

    this.state = {email: '', password: ''}
  }

  render () {
    return (
      <div>
        <Container>
          <Row className="login">
            <Col sm={{size: 6, offset: 3}}>
              <InputGroup>
                <Input id="email" placeholder="email" value={this.state.email} onChange={this.handleEmailChange}/>
              </InputGroup>
            </Col>
            <Col sm={{size: 6, offset: 3}}>
              <InputGroup>
                <Input id="password" placeholder="password" type="password" value={this.state.password}
                       onChange={this.handlePasswordChange}/>
              </InputGroup>
            </Col>
            <Col sm={{size: 6, offset: 3}}>
              <Button id="login" color="primary" onClick={this.login}>Login</Button>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default LoginPage
