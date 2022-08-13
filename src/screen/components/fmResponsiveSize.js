import React, { Component } from "react";
import { connect } from "react-redux";
import { baseUrl } from "../../apiService/configuration";
class FmResponsiveSize extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return baseUrl === "http://localhost:44314/api" ? (
      <div class="d-block">
        <div class="d-none d-sm-none d-md-none d-lg-none d-xl-none d-xxl-block">
          XXL Screen
        </div>
        <div class="d-none d-sm-none d-md-none d-lg-none d-xl-block d-xxl-none">
          XL Screen
        </div>
        <div class="d-none d-sm-none d-md-none d-lg-block d-xl-none d-xxl-none">
          LG Screen
        </div>
        <div class="d-none d-sm-none d-md-block d-lg-none d-xl-none d-xxl-none">
          MD Screen
        </div>
        <div class="d-none d-sm-block d-md-none d-lg-none d-xl-none d-xxl-none">
          SM Screen
        </div>
        <div class="d-block d-sm-none d-md-none d-lg-none d-xl-none d-xxl-none">
          XS Screen
        </div>
      </div>
    ) : null;
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(FmResponsiveSize);
