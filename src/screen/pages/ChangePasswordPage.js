import React, { Component } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as authActions from "../../action/authAction";
import FmCheckBox from "../components/FmCheckBox";
import FmTextInput from "../components/FmTextInput";
import { updatePassword } from "../../apiService/userAPI";

class ChangePasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userModel: {
        username: "",
        NewPassword: "",
        confirmpassword: "",
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
    var result = await updatePassword(this.state.userModel);
    if (result.IsSuccess) {
      localStorage.removeItem("token");
      localStorage.removeItem("userinfo");
      window.location.reload();
    } else {
      this.setState({
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
      <Container>
        <Row style={{ marginTop: 150 }}>
          <Col md={{ span: 4, offset: 4 }} sm={{ span: 10, offset: 1 }}>
            <Form>
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
                    id="NewPassword"
                    name="NewPassword"
                    label="New Password"
                    type="password"
                    placeholder="New Password"
                    onChange={this.onChange}
                    value={this.state.userModel.NewPassword}
                  />
                  <FmTextInput
                    id="confirmpassword"
                    name="confirmpassword"
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm Password"
                    onChange={this.onChange}
                    value={this.state.userModel.password}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={{ span: 12 }}>
                  <Button
                    variant="primary"
                    style={{ width: "100%" }}
                    onClick={this.onloginPress}
                  >
                    Change Password
                  </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordPage);
