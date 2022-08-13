import React, { Component } from "react";
import { connect } from "react-redux";
import { ListBookingHistory } from "../../apiService/bookingAPI";
import FmLoadingScreen from "../components/FmLoadingScreen";
import { PanelBar, PanelBarItem } from "@progress/kendo-react-layout";
import { fileSizeConverter } from "../../commonService";
import $ from "jquery";
import UserEquipmentUsage from "./UserEquipmentUsage";

class UserBookingHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      isLoading: false,
      searchText: "",
      selectedSaleId: 0,
      selectedEquipmentId: 0,
    };
  }

  async componentDidMount() {
    await this.listBookingHistory();
  }

  listBookingHistory = async () => {
    this.setState({ isLoading: true });
    const bookings = await ListBookingHistory();
    this.setState({ bookings, isLoading: false });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  viewDetails = async (salesId, equipmentId) => {
    if (!$("#usagecontainer").is(":visible")) {
      this.props.history.push(`/usage/${salesId}/${equipmentId}`);
    } else {
      this.setState(
        {
          selectedSaleId: 0,
          selectedEquipmentId: 0,
        },
        () => {
          this.setState({
            selectedSaleId: salesId,
            selectedEquipmentId: equipmentId,
          });
        }
      );
    }
  };

  render() {
    return (
      <div class="container-fluid">
        <FmLoadingScreen isLoading={this.state.isLoading} />
        <div class="row">
          {this.state.bookings.length > 0 ? (
            <>
              <div class="col-12 col-md-6 col-lg-7 col-xl-4">
                <div class="row">
                  <div class="col-12 mb-2 d-none">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Search here"
                      value={this.state.searchText}
                      onChange={this.onChange}
                      name="searchText"
                    />
                  </div>
                  <div class="col-12">
                    <PanelBar expandMode="single">
                      {this.state.bookings.map((booking) => (
                        <PanelBarItem
                          expanded={true}
                          title={booking.ProjectName}
                        >
                          {booking.Equipments.map((eq) => (
                            <div class="row border px-3 py-2">
                              <div clas="col-12">
                                <h6 class="m-0 p-0">
                                  <i class="icon-tools"></i>{" "}
                                  {eq.Name || eq.ServiceType}
                                </h6>
                              </div>
                              <div class="col-12">
                                <p class="m-0 p-0 text-muted">
                                  <i class="icon-calendar"></i>{" "}
                                  {eq.BorrowedDateFromST} -{" "}
                                  {eq.BorrowedDateToST}
                                </p>
                              </div>
                              {eq.Name ? (
                                <div class="col-12">
                                  <p class="m-0 p-0 text-muted">
                                    <i class="icon-settings_input_antenna"></i>{" "}
                                    {eq.Type}
                                  </p>
                                </div>
                              ) : null}
                              {eq.TypeId === 3 || eq.TypeId === 1 ? (
                                <>
                                  <div class="col-12 mt-2">
                                    <div class="row">
                                      <div class="col-4 text-center">
                                        <p class="p-0 m-0">
                                          {fileSizeConverter(eq.CellUsage)}
                                        </p>
                                        <p class="p-0 m-0">
                                          <i class="icon-phone4"></i> Cell
                                        </p>
                                      </div>
                                      <div class="col-4 text-center">
                                        <p class="p-0 m-0">
                                          {fileSizeConverter(eq.OtherUsage)}
                                        </p>
                                        <p class="p-0 m-0">
                                          <i class="icon-devices_other"></i>{" "}
                                          Other
                                        </p>
                                      </div>
                                      <div class="col-4 text-center">
                                        <p class="p-0 m-0">
                                          {fileSizeConverter(eq.TotalUsage)}
                                        </p>
                                        <p class="p-0 m-0">
                                          <i class="icon-usage"></i> Total
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="col-12 mt-2">
                                    <button
                                      class="btn btn-sm btn-primary float-right"
                                      onClick={() => {
                                        this.viewDetails(
                                          booking.SaleId,
                                          eq.EquipmentId
                                        );
                                      }}
                                    >
                                      View Details
                                    </button>
                                  </div>
                                </>
                              ) : null}
                            </div>
                          ))}
                        </PanelBarItem>
                      ))}
                    </PanelBar>
                  </div>
                </div>
              </div>
              <div
                id="usagecontainer"
                class="col-md-6 col-lg-5 col-xl-8 d-none d-sm-none d-md-none d-lg-block d-xl-block d-xxl-block"
              >
                {this.state.selectedSaleId !== 0 ? (
                  <UserEquipmentUsage
                    salesid={this.state.selectedSaleId}
                    equipmentid={this.state.selectedEquipmentId}
                  />
                ) : (
                  <div class="card shadow-sm">
                    <div class="card-body">
                      <div class="row">
                        <div class="col-12 text-center">
                          <h1>
                            <i class="icon-broken_image"></i>
                          </h1>
                          <p>
                            Please select a Gateway to see the usage breakdown
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div class="col-12">
              <div class="card shadow">
                  <div class="card-title text-center">
                      <h1><i class="icon-broken_image"></i></h1>
                      <p>No Booking to displays</p>
                  </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UserBookingHistory);
