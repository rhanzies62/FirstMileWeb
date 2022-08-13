import React, { Component } from "react";
import { connect } from "react-redux";

class BookingTypeLabel extends Component {
  render() {
    let type = "";
    switch (this.props.Status) {
      case "Lead":
        type = "text-primary";
        break;
      case "Quote":
        type = "text-warning";
        break;
      case "Booking":
        type = "text-success";
        break;
      case "Job":
        type = "text-secondary";
        break;
      case "Invoice":
        type = "text-info";
        break;
      case "Cancelled":
        type = "text-danger";
        break;
      default:
        type = "";
    }

    return <span className={type}>{this.props.Status}</span>;
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BookingTypeLabel);
