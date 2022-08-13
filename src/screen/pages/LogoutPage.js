import React, { Component } from "react";
import * as authActions from "../../action/authAction";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
class LogoutPage extends Component {
  componentDidMount() {
    localStorage.removeItem("token");
    this.props.actions.updateAuth(false);
    this.props.actions.updateUserInfo("");
    this.props.history.push("/");
  }
  render() {
    return <div></div>;
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
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutPage);
