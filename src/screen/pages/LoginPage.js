import React, { Component } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as authActions from "../../action/authAction";
import FmCheckBox from "../components/FmCheckBox";
import FmTextInput from "../components/FmTextInput";
import { login } from "../../apiService/userAPI";
import FmLoadingScreen from "../components/FmLoadingScreen";

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userModel: {
        username: "",
        password: "",
      },
      loginResult: {
        hasError: false,
        message: "",
      },
    };
  }

  onChange = (e) => {
    this.setState({
      userModel: {
        ...this.state.userModel,
        [e.target.name]: e.target.value,
      },
    });
  };

  onloginPress = async () => {
    this.setState({ isLoading: true });
    var result = await login(this.state.userModel);
    if (result.IsSuccess) {
      this.props.actions.updateLoginInfo({
        isLoggedIn: true,
        userType: `${result.Data.UserTypeId}`,
        userInfo: result.Data,
      });
      //window.location.reload();
    } else {
      this.setState({
        isLoading: false,
        loginResult: {
          hasError: true,
          message: result.Message,
        },
      });
    }
  };
  render() {
    const logo = require("../../img/brand.jpg");
    return (
      <Container className="mt-5 mb-5">
        <FmLoadingScreen isLoading={this.state.isLoading} />
        <Row>
          <Col
            lg={{ span: 4, offset: 4 }}
            md={{ span: 6, offset: 3 }}
            sm={{ span: 10, offset: 1 }}
          >
            <Form
              onSubmit={async (e) => {
                e.preventDefault();
                //await this.onloginPress();
              }}
            >
              <Row>
                <Col className="text-center">
                  <img src={logo} className="" width={150} />
                </Col>
              </Row>
              {this.state.loginResult.hasError ? (
                <Row style={{ marginTop: 20 }}>
                  <Col>
                    <Alert variant="danger">
                      <strong>Incorrect!</strong>
                      <br />
                      {this.state.loginResult.message}
                    </Alert>
                  </Col>
                </Row>
              ) : null}
              <Row style={{ marginTop: 20 }}>
                <Col>
                  <FmTextInput
                    id="username"
                    name="username"
                    label="Username"
                    type="text"
                    placeholder="Username"
                    onChange={this.onChange}
                    value={this.state.userModel.username}
                  />
                  <FmTextInput
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Password"
                    onChange={this.onChange}
                    value={this.state.userModel.password}
                  />
                </Col>
              </Row>
              <Row>
                <Button variant="link">Forgot password?</Button>
              </Row>
              <Row>
                <Col md={{ span: 12 }}>
                  <input
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                    onClick={this.onloginPress}
                    value="Login"
                  />
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({});

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      updateAuth: bindActionCreators(
        authActions.updateAuthentication,
        dispatch
      ),
      updateUserInfo: bindActionCreators(authActions.updateUserInfo, dispatch),
      updateLoginInfo: bindActionCreators(
        authActions.updateLoginInfo,
        dispatch
      ),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
