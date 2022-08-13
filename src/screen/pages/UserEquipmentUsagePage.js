import React, { Component } from "react";
import { connect } from "react-redux";
import UserEquipmentUsage from "./UserEquipmentUsage";
import $ from "jquery";

class UserEquipmentUsagePage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    window.addEventListener("resize", () => {
      if(!$('#usagepage').is(":visible")){
        //this.props.history.goBack();
      }
    });
  }

  render() {
    return (
      <div id="usagepage" class="container-fluid d-block d-sm-block d-md-block d-lg-none d-xl-none d-xxl-none">
        <div class="row">
          <div class="col-12">
            <UserEquipmentUsage salesid={this.props.match.params.salesid} equipmentid={this.props.match.params.equipmentid} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserEquipmentUsagePage);
