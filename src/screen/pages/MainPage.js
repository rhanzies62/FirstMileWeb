import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as authActions from "../../action/authAction";
import NavigationSideBar from "../components/screens/NavigationSideBar";

class MainPage extends Component {
  render() {
    return <NavigationSideBar />;
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
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
