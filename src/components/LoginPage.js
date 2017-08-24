//@flow
import React, {Component} from 'react'
import {Button, Col, Container, Input, InputGroup, Row} from 'reactstrap'
import '../styles/LoginPage.css'

type Props = {
    login: any,
}

type State = {
    email: string;
    password: string;
}

class LoginPage extends Component<void, Props, State> {
    state: State;

    constructor(props: Props) {
        super(props)

        this.state = {email: '', password: ''};

        (this: any).handleEmailChange = this.handleEmailChange.bind(this);
        (this: any).handlePasswordChange = this.handlePasswordChange.bind(this);
        (this: any).login = this.login.bind(this);
    }

    handleEmailChange(event: Event) {
        // $FlowFixMe
        this.setState({email: event.target.value})
    }

    handlePasswordChange(event: Event) {
        // $FlowFixMe
        this.setState({password: event.target.value})
    }

    login() {
        this.props.login(this.state.email, this.state.password)
    }

    render() {
        return (
            <div>
                <Container>
                    <Row className="login">
                        <Col sm={{size: 6, offset: 3}}>
                            <InputGroup>
                                <Input placeholder="email" value={this.state.email} onChange={this.handleEmailChange}/>
                            </InputGroup>
                        </Col>
                        <Col sm={{size: 6, offset: 3}}>
                            <InputGroup>
                                <Input placeholder="password" type="password" value={this.state.password}
                                       onChange={this.handlePasswordChange}/>
                            </InputGroup>
                        </Col>
                        <Col sm={{size: 6, offset: 3}}>
                            <Button color="primary" onClick={this.login}>Login</Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default LoginPage