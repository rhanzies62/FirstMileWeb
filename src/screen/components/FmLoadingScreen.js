import React, { Component } from "react";
import { connect } from "react-redux";

class FmLoadingScreen extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return this.props.isLoading ? (
      <div className="position-fixed loading k-loading-mask">
        <span className="k-loading-text">
          {this.props.message || "Loading"}
        </span>
        <div className="k-loading-image"></div>
        <div className="k-loading-color"></div>
      </div>
    ) : null;
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(FmLoadingScreen);
