import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { ListAssignedUserByCustomerId } from "../../apiService/customerAPI";
import { ListBookingByCustomerId } from "../../apiService/bookingAPI";
import FmLoadingScreen from "../components/FmLoadingScreen";
import BookingDetailsModal from "./BookingDetailsModal";

export class CustomerDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerUsers: [],
      customerBookings: [],
      isLoading: false,
      selectedSalesId: 0,
    };
  }

  async componentDidMount() {
    await this.getCustomerUsers();
  }
  async componentDidUpdate(prevProp) {
    if (
      prevProp.selectedCustomer.CustomerId !==
      this.props.selectedCustomer.CustomerId
    ) {
      await this.getCustomerUsers();
    }
  }
  async getCustomerUsers() {
    this.setState({ isLoading: true });
    const customerUsers = await ListAssignedUserByCustomerId(
      this.props.selectedCustomer.CustomerId
    );
    const customerBookings = await ListBookingByCustomerId(
      this.props.selectedCustomer.CustomerId
    );
    this.setState({ customerUsers, customerBookings, isLoading: false });
  }
  render() {
    return (
      <>
        <FmLoadingScreen isLoading={this.state.isLoading} />
        <div class="row">
          <div class="col-12">
            <div class="row">
              <div class="col-12">
                {this.props.selectedCustomer.CustomerId ? (
                  <>
                    <div class="card shadow-sm">
                      <div class="card-body">
                        <div class="row pb-1 border-bottom">
                          <div class="col-6 col-lg-8">
                            <p class="card-title m-0 font-weight-bold">
                              <i class="icon-info"></i> ID:{" "}
                              {this.props.selectedCustomer.CustomerId}
                            </p>
                            <div class="row">
                              <div class="col-12 smaller">
                                <label class="text-muted font-weight-bold mb-0">
                                  Created At:{" "}
                                </label>{" "}
                                {moment(
                                  this.props.selectedCustomer.CreatedDate
                                ).format("DD/MM/YYYY")}
                                , <strong>By</strong>{" "}
                                {this.props.selectedCustomer.CreatedBy}
                              </div>
                              {this.props.selectedCustomer.UpdatedDate ? (
                                <div class="col-12 smaller">
                                  <label class="text-muted font-weight-bold mb-0">
                                    Last Update:{" "}
                                  </label>{" "}
                                  {moment(
                                    this.props.selectedCustomer.UpdatedDate
                                  ).format("DD/MM/YYYY")}
                                  , <strong>By</strong>{" "}
                                  {this.props.selectedCustomer.UpdatedBy}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          {this.props.displayEditButton ? (
                            <div class="col-6 col-lg-4 text-right">
                              <h5 class="card-title">
                                <button
                                  class="btn btn-success"
                                  onClick={() => {
                                    if (this.props.onEditCallBack)
                                      this.props.onEditCallBack();
                                  }}
                                >
                                  <i class="icon-edit-pencil"></i>
                                </button>
                              </h5>
                            </div>
                          ) : null}
                        </div>
                        <div class="row mt-2">
                          <div class="col-12">
                            <p class="card-title m-0">
                              <i class="icon-users"></i>{" "}
                              {this.props.selectedCustomer.Name}
                            </p>
                          </div>
                          <div class="col-12">
                            <p class="card-title m-0 ">
                              <i class="icon-addressbook"></i>{" "}
                              {`${this.props.selectedCustomer.Address || ""}, ${
                                this.props.selectedCustomer.City || ""
                              } ${
                                this.props.selectedCustomer.Province || ""
                              }, ${
                                this.props.selectedCustomer.PostalCode
                                  ? this.props.selectedCustomer.PostalCode.toUpperCase()
                                  : ""
                              }  ${this.props.selectedCustomer.Country || ""}`}
                            </p>
                          </div>
                          {this.props.selectedCustomer.Email ? (
                            <div class="col-12">
                              <p class="card-title m-0 ">
                                <i class="icon-email"></i>{" "}
                                {this.props.selectedCustomer.Email}
                              </p>
                            </div>
                          ) : null}

                          {this.props.selectedCustomer.Phone ? (
                            <div class="col-12">
                              <p class="card-title m-0 ">
                                <i class="icon-phone10"></i>{" "}
                                {this.props.selectedCustomer.Phone}
                              </p>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div class="card shadow-sm mt-2">
                      <div class="card-body">
                        <div class="row pb-1 border-bottom">
                          <div class="col-12 mb-2">
                            <p class="card-title m-0 font-weight-bold">
                              <i class="icon-users"></i> Users
                            </p>
                          </div>
                        </div>
                        <div class="row mt-2">
                          {this.state.customerUsers.length > 0 ? (
                            this.state.customerUsers.map((cu) => (
                              <div class="col-12 col-md-6 mb-2 px-1">
                                <div class="p-2 border shadow-sm">
                                  <div style={{ minHeight: 72 }}>
                                    <p class="card-title m-0 p-0 font-weight-bold">
                                      <i class="icon-business-card"></i>{" "}
                                      {cu.FirstName} {cu.LastName}
                                    </p>
                                    <p class="card-title m-0 p-0">
                                      <i class="icon-key3"></i> {cu.Username}
                                    </p>
                                    {cu.PasswordRaw ? (
                                      <p class="card-title m-0 p-0">
                                        <i class="icon-locked"></i>{" "}
                                        {cu.PasswordRaw}
                                      </p>
                                    ) : null}
                                  </div>

                                  <button class="w-100 btn btn-danger btn-sm mt-2">
                                    Deactivate
                                  </button>
                                  <button class="w-100 btn btn-warning btn-sm mt-2">
                                    Reset Password
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div class="col-12 text-center">
                              <h1>
                                <i class="icon-files-empty"></i>
                              </h1>
                              <p>
                                No users available for this customer.
                                <br />
                                {this.props.displayEditButton ? (
                                  <button
                                    class="btn btn-success"
                                    onClick={() => {
                                      if (this.props.onEditCallBack)
                                        this.props.onEditCallBack();
                                    }}
                                  >
                                    <i class="icon-user-add"></i> Add Users
                                  </button>
                                ) : null}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div class="card shadow-sm mt-2">
                      <div class="card-body">
                        <div class="row pb-1 border-bottom">
                          <div class="col-12 mb-2">
                            <p class="card-title m-0 font-weight-bold">
                              <i class="icon-notebook"></i> Bookings
                            </p>
                          </div>
                        </div>
                        <div class="row mt-2">
                          {this.state.customerBookings.length > 0 ? (
                            this.state.customerBookings.map((cb) => (
                              <div class="col-md-6 col-xl-12 mb-2 px-1">
                                <div
                                  class="p-2 shadow-sm"
                                  style={{
                                    borderTopWidth: 1,
                                    borderRightWidth: 1,
                                    borderBottomWidth: 1,
                                    borderLeftWidth: 10,
                                    borderColor: cb.Color,
                                    borderLeftColor: cb.Color,
                                    borderStyle: "solid",
                                  }}
                                >
                                  <div>
                                    <p
                                      class="card-title m-0 p-0 font-weight-bold"
                                      style={{ color: cb.Color }}
                                    >
                                      <i class="icon-film2"></i>{" "}
                                      {cb.ProjectName.toUpperCase()}
                                    </p>
                                    <p class="card-title m-0 p-0 text-muted text-small">
                                      <i class="icon-addressbook"></i>{" "}
                                      {cb.Status}
                                    </p>
                                    <p class="card-title m-0 p-0 text-muted text-small">
                                      <i class="icon-user"></i>{" "}
                                      {cb.CreatedByUserName}
                                    </p>
                                    <p class="card-title m-0 p-0 text-muted text-small">
                                      <i class="icon-calendar"></i>{" "}
                                      {moment(cb.CreatedDate).format(
                                        "MMM DD, YYYY"
                                      )}
                                    </p>
                                    <div class="w-100 mt-2 clearfix">
                                      <button
                                        class="float-right btn btn-primary btn-sm"
                                        onClick={() => {
                                          this.setState({
                                            selectedSalesId: cb.SalesId,
                                            showDetailsModal: true,
                                          });
                                        }}
                                      >
                                        View Details
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div class="col-12 text-center">
                              <h1>
                                <i class="icon-files-empty"></i>
                              </h1>
                              <p>No booking available for this customer.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div class="card shadow-sm">
                    <div class="card-body">
                      <div class="row">
                        <div class="col-12 text-center">
                          <h1>
                            <i class="icon-files-empty"></i>
                          </h1>
                          <p>Please select an customer to view the details.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {this.state.selectedSalesId && this.state.showDetailsModal ? (
          <BookingDetailsModal
            salesId={this.state.selectedSalesId}
            show={this.state.showDetailsModal}
            displayEditButton={false}
            onHide={() => {
              this.setState({ showDetailsModal: !this.state.showDetailsModal });
            }}
          />
        ) : null}
      </>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetail);
