import React, { Component } from "react";
import { connect } from "react-redux";
import { fileSizeConverter } from "../../commonService";
import GoogleMapReact from "google-map-react";
import moment from "moment";
import Marker from "../components/Marker";

export class EquipmentDetails extends Component {
  render() {
    return (
      <>
        <div class="shadow-sm card mb-3">
          <div class="card-body">
            <div class="row pb-1 border-bottom">
              {this.props.equipment.EquipmentId !== 0 ? (
                <div class="row mb-2">
                  <div class="col-12 smaller">
                    <label class="text-muted font-weight-bold mb-0">
                      Created At:{" "}
                    </label>{" "}
                    {moment(this.props.equipment.CreatedDate).format(
                      "MM/DD/YYYY"
                    )}
                    , <strong>By</strong> {this.props.equipment.Username}
                  </div>
                  {this.props.equipment.UpdatedByUsername ? (
                    <div class="col-12 smaller">
                      <label class="text-muted font-weight-bold mb-0">
                        Last Update:{" "}
                      </label>{" "}
                      {moment(this.props.equipment.UpdatedDate).format(
                        "MM/DD/YYYY"
                      )}
                      , <strong>By</strong>{" "}
                      {this.props.equipment.UpdatedByUsername}
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div class="col-6 col-lg-8">
                <p class="card-title m-0 font-weight-bold">
                  <i class="icon-info"></i> ID:{" "}
                  {this.props.equipment.EquipmentId}
                </p>
              </div>
              {this.props.equipment.EquipmentId !== 0 ? (
                <div class="col-6 col-lg-4 text-right">
                  <h5 class="card-title">
                    <button
                      class="btn btn-success"
                      onClick={this.props.onEditButtonClick}
                    >
                      <i class="icon-edit-pencil"></i>
                    </button>
                    <button
                      class={`ml-1 btn ${
                        this.props.equipment.IsActive
                          ? "btn-danger"
                          : "btn-warning"
                      }`}
                      onClick={this.props.onRemoveRestoreEquipment}
                    >
                      <i
                        class={`${
                          this.props.equipment.IsActive
                            ? "icon-delete1"
                            : " icon-settings_backup_restore"
                        }`}
                      ></i>
                    </button>
                  </h5>
                </div>
              ) : null}
            </div>

            <div class="row">
              {this.props.equipment.EquipmentId === 0 ? (
                <div class="col-12 text-center">
                  <label class="text-muted">
                    Choose an equipment to view the Details
                  </label>
                </div>
              ) : (
                <div class="col-12 mt-2">
                  <div class="row">
                    <div class="col-12">
                      <label class="font-weight-bold mb-0">Name: </label>{" "}
                      {this.props.equipment.Name}
                    </div>
                    <div class="col-12">
                      <label class="font-weight-bold mb-0">Type: </label>{" "}
                      {this.props.equipment.Type}
                    </div>
                    {this.props.equipment.TypeId === 3 ||
                    this.props.equipment.TypeId === 1 ? (
                      <>
                        <div class="col-12">
                          <label class="font-weight-bold mb-0">Serial: </label>{" "}
                          {this.props.equipment.Serial}
                        </div>
                        <div class="col-12">
                          <label class="font-weight-bold mb-0">
                            Dejero ID:{" "}
                          </label>{" "}
                          {this.props.equipment.GatewayId}
                        </div>
                      </>
                    ) : null}
                    <div class="col-12">
                      <label class="font-weight-bold mb-0">Company: </label>{" "}
                      {this.props.equipment.Company}
                    </div>
                    <div class="col-12 mt-1 border-top">
                      <label class="font-weight-bold mb-0">Description: </label>{" "}
                      {this.props.equipment.Description}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div class="shadow-sm card mb-3">
          <div class="card-body">
            <p class="card-title pb-1 border-bottom font-weight-bold">
              <i class="icon-history"></i> Equipment History
            </p>
            <div class="row">
              {this.props.equipment.EquipmentId !== 0 ? (
                <>
                  {this.props.equipmentHistory.length === 0 ? (
                    <div class="col-12 text-center">
                      <h1 class="text-muted">
                        <i class="icon-magnifier"></i>
                      </h1>
                      <label class="text-muted">
                        No Booking Found for this Equipment.
                      </label>
                    </div>
                  ) : null}
                  <div style={{ maxHeight: 324, overflow: "auto" }}>
                    {this.props.equipmentHistory.map((history) => (
                      <div class="col-12 py-2 border-bottom user-select-none bookingItem">
                        <div class="row">
                          <div class="col-12 col-md-8 px-0">
                            <h6 class="p-0 m-0">
                              <i class="icon-film2"></i>{" "}
                              {history.Booking.ProjectName}
                            </h6>
                            <label class="p-0 m-0 w-100">
                              <i class="icon-people_alt"></i>{" "}
                              {history.Booking.Customer.Name}
                            </label>
                            <label class="p-0 m-0 w-100">
                              <i class="icon-addressbook"></i>{" "}
                              {history.Booking.Status}
                            </label>
                            <label class="p-0 m-0 w-100">
                              <i class="icon-calendar"></i>{" "}
                              {moment(history.BorrowedDateFrom).format(
                                "MM/DD/YYYY"
                              )}{" "}
                              -{" "}
                              {moment(history.BorrowedDateTo).format(
                                "MM/DD/YYYY"
                              )}
                            </label>
                          </div>
                          {this.props.equipment.TypeId === 3 || this.props.equipment.TypeId === 1 ? (
                            <div class="col-12 col-md-4 text-right text-success small">
                              <div class="text-right">
                                <label class="p-0 m-0 w-100 text-success">
                                  <i class="icon-sd_storage"></i>
                                  {fileSizeConverter(history.totalUsage)}
                                </label>
                              </div>
                            </div>
                          ) : null}
                        </div>
                        <div class="row">
                          <div class="col-12 mt-1">
                            <button
                              class="btn btn-primary btn-sm float-right"
                              onClick={() => {
                                this.props.onViewBookingDetails(history);
                              }}
                            >
                              View Details <i class="icon-magnifying-glass"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div class="col-12 text-center">
                  <label class="text-muted">
                    Choose an equipment to view the Details
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
        {this.props.equipment.TypeId === 3 ||
        this.props.equipment.TypeId === 1 ? (
          <div class="shadow-sm card mb-3">
            <div class="card-body">
              <p class="font-weight-bold card-title pb-1 border-bottom">
                <i class="icon-map3"></i>Equipment Location
              </p>
              <div class="row px-0 px-md-3">
                {this.props.equipment.EquipmentId !== 0 ? (
                  <div style={{ width: "100%", height: 150 }}>
                    <GoogleMapReact
                      bootstrapURLKeys={{
                        key: "AIzaSyABgutERDOABxvVYe0-0mhBvqc2-akKv08",
                      }}
                      defaultZoom={15}
                      defaultCenter={
                        this.props.location.latitude
                          ? {
                              lat: this.props.location.latitude,
                              lng: this.props.location.longitude,
                            }
                          : {
                              lat: 59.95,
                              lng: 30.33,
                            }
                      }
                    >
                      {this.props.location.latitude ? (
                        <Marker
                          lat={this.props.location.latitude}
                          lng={this.props.location.longitude}
                          color={"red"}
                          onClick={() => {
                            //alert(l.Equipment.CustomerName);
                          }}
                        />
                      ) : null}
                    </GoogleMapReact>
                  </div>
                ) : (
                  <div class="col-12 text-center">
                    <label class="text-muted">
                      Choose an equipment to view the Details
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentDetails);
