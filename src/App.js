import React, { Component } from "react";

import logo from "./logo.svg";
import { connect } from "react-redux";
import "./App.css";
import "./styles/screen-sizes/xl-screen.css";
import "./styles/screen-sizes/l-screen.css";
import "./styles/screen-sizes/m-screen.css";
import "./styles/screen-sizes/sm-screen.css";
import "./styles/screen-sizes/xs-screen.css";
import "./styles/icon.css";
import "./styles/simple-sidebar.css";
import "./bootstrap.min.css";
import "./styles/screen-sizes/grid.xxl.css";
import LoginPage from "./screen/pages/LoginPage";
import MainPage from "./screen/pages/MainPage";
import { bindActionCreators } from "redux";
import * as authActions from "./action/authAction";
import jwt from "jsonwebtoken";
import ChangePasswordPage from "./screen/pages/ChangePasswordPage";
import "./web.config";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogIn: false,
      isSiteReady: false,
    };
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      const info = JSON.parse(localStorage.getItem("userinfo"));
      const { exp, ust } = jwt.decode(localStorage.getItem("token"));
      const isValid = Date.now() >= exp * 1000;

      this.props.actions.updateLoginInfo({
        isLoggedIn: !isValid,
        userType: ust,
        userInfo: info,
      });
    }
  }

  render() {
    return this.props.auth.isLoggedIn ? (
      this.props.auth.userInfo && !this.props.auth.userInfo.IsPasswordChange ? (
        <ChangePasswordPage />
      ) : (
        <MainPage />
      )
    ) : (
      <LoginPage />
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}
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

export default connect(mapStateToProps, mapDispatchToProps)(App);

