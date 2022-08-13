import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import React, { Component } from "react";
import { connect } from "react-redux";

class BookedEquipmentGrid extends Component {
  render() {
    const data = this.props.dataItem.details;
    if (data) {
      return (
        <Grid data={data}>
          <Column field="Name" title="Name" />
          <Column field="Serial" title="Serial" />
          <Column field="Type" title="Type" />
          <Column field="BorrowedDateFromST" title="Borrowed Date From" />
          <Column field="BorrowedDateToST" title="Borrowed Date To" />
          <Column field="Username" title="Username" />
        </Grid>
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
)(BookedEquipmentGrid);
