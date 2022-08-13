import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { fileSizeConverter } from "../../../commonService";

class GatewayUsageCard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      equipmentUsage,
      selectedEquipmentType,
      selectedBooking,
    } = this.props;
    return (
      <div class="col-12 col-md-6 col-lg-12 mx-0">
        <div class="shadow-sm card mb-3">
          <div class="card-body">
            <p class="card-title pb-1 px-3 border-bottom font-weight-bold">
              <i class="icon-data_usage"></i> Current Usage
            </p>
            {equipmentUsage.usageData && (selectedEquipmentType === 3 || selectedEquipmentType === 1) ? (
              <div class="row">
                <div class="col-6 col-md-4 text-center">
                  <h2>
                    {fileSizeConverter(equipmentUsage.usageData.cell_usage)}
                  </h2>
                  <h4>
                    <i class="icon-phone4"></i> Cell
                  </h4>
                </div>
                <div class="col-6 col-md-4 text-center">
                  <h2>
                    {fileSizeConverter(
                      equipmentUsage.usageData.total_usage -
                        equipmentUsage.usageData.cell_usage
                    )}
                  </h2>
                  <h4>
                    <i class="icon-devices_other"></i> Other
                  </h4>
                </div>
                <div class="col-12 col-md-4 text-center">
                  <h2>
                    {fileSizeConverter(equipmentUsage.usageData.total_usage)}
                  </h2>
                  <h4>
                    <i class="icon-data_usage"></i> Total
                  </h4>
                </div>
                <div class="col-12">
                  <label class="text-muted">
                    Usage displayed is from{" "}
                    {moment(selectedBooking.BorrowedDateFrom).format(
                      "MM/DD/YYYY"
                    )}{" "}
                    to {moment(new Date()).format("MM/DD/YYYY")}
                  </label>
                </div>
              </div>
            ) : (
              <div class="row">
                <div class="col-12 text-center">
                  {selectedEquipmentType === 3 ||
                  selectedEquipmentType === 0 ? (
                    <label class="text-muted">
                      Choose an equipment to view the booking details
                    </label>
                  ) : (
                    <>
                      <h4>
                        <i class="icon-speaker_notes_off"></i>
                      </h4>
                      <label class="text-muted">
                        Usage data is not available for the selected Equipment
                        type
                      </label>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GatewayUsageCard);
