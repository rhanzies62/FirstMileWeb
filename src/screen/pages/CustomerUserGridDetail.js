import { Button } from "@progress/kendo-react-buttons";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import React, { Component } from "react";
import { connect } from "react-redux";
import CustomerUserFormPage from "./CustomerUserFormPage";
import { ListAssignedUserByCustomerId } from "../../apiService/customerAPI";

class CustomerUserGridDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewEquipmentModal: false,
      data: this.props.dataItem.details,
    };
  }
  toggleDialog = () => {
    this.setState({
      showNewEquipmentModal: !this.state.showNewEquipmentModal,
    });
  };

  refreshList = async () => {
    const customerUser = await ListAssignedUserByCustomerId(
      this.props.dataItem.CustomerId
    );
    this.setState({data:customerUser})
  }

  render() {
    if (this.state.data) {
      return (
        <div className="row">
          <div
            className="col-md-12"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="primary"
              style={{ width: "40%" }}
              onClick={() => {
                this.setState({
                  showNewEquipmentModal: true,
                });
              }}
            >
              Add New User
            </Button>
          </div>
          <div className="col-md-12" style={{ marginTop: 10 }}>
            <Grid data={this.state.data}>
              <Column field="UserId" title="User Id" />
              <Column field="FirstName" title="First Name" />
              <Column field="LastName" title="Last Name" />
              <Column field="Username" title="Username" />
              <Column field="PasswordRaw" title="Password" />
            </Grid>
          </div>
          {this.state.showNewEquipmentModal ? (
            <CustomerUserFormPage
              customerId={this.props.dataItem.CustomerId}
              onClose={this.toggleDialog}
              onSubmitSuccess={this.refreshList}
            />
          ) : null}
        </div>
      );
    }
    return (
      <div style={{ height: "50px", width: "100%" }}>
        <div style={{ position: "absolute", width: "100%" }}>
          <div className="k-loading-image" />
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
)(CustomerUserGridDetail);
