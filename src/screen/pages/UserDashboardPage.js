import React, { Component } from "react";
import { connect } from "react-redux";
import { ListActiveBooking } from "../../apiService/bookingAPI";
import {
  GetGatewayUsage,
  GetSourceUsage,
  ListActivityType,
  listEquipmentTypes,
} from "../../apiService/lookUpAPI";
import * as userApiService from "../../apiService/userAPI";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardActions,
  CardImage,
  CardSubtitle,
} from "@progress/kendo-react-layout";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartTitle,
  ChartLegend,
} from "@progress/kendo-react-charts";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { DateRangePicker, TimePicker } from "@progress/kendo-react-dateinputs";
import { DatePicker, Calendar } from "@progress/kendo-react-dateinputs";
import { CustomCalendar } from "../components/Calendar";
import moment from "moment";
import { fileSizeConverter } from "../../commonService";
import FmResponsiveSize from "../components/fmResponsiveSize";
import UserEquipmentUsage from "./UserEquipmentUsage";
import $ from "jquery";
import FmLoadingScreen from "../components/FmLoadingScreen";
import FrameIOFormModal from "../components/modals/FrameIOFormModal";

export class UserDashboardPage extends Component {
  constructor(props) {
    super(props);
    this.sortByGateway = [
      { Id: "Name", Description: "Name" },
      { Id: "BorrowedDateFromST", Description: "Borrowed From" },
      { Id: "BorrowedDateToST", Description: "Borrowed To" },
      { Id: "TotalUsage", Description: "Total Usage" },
      { Id: "CellUsage", Description: "Cell Usage" },
      { Id: "OtherUsage", Description: "Other Usage" },
    ];
    this.sortBy = [
      { Id: "Name", Description: "Name" },
      { Id: "BorrowedDateFromST", Description: "Borrowed From" },
      { Id: "BorrowedDateToST", Description: "Borrowed To" },
    ];
    this.state = {
      displayfilter: false,
      selected: 0,
      ActiveBooking: [],
      hourStart: null,
      hourEnd: null,
      dayStart: null,
      dayEnd: null,
      monthStart: null,
      monthEnd: null,
      categories: [],
      activityTypes: [],
      displayEquipmentType: false,
      equipmentType: [],
      sortby: [
        { Id: "Name", Description: "Name" },
        { Id: "BorrowedDateFromST", Description: "Borrowed From" },
        { Id: "BorrowedDateToST", Description: "Borrowed To" },
      ],
      sort: ["asc", "desc"],

      searchText: "",
      originalList: [],
      selectedServiceType: 0,
      selectedEquipmentType: 0,
      selectedSort: "asc",
      selectedSortBy: "Name",

      selectedSaleId: 0,
      selectedEquipmentId: 0,
      isLoading: false,
      displayFrameIOModal: false,
    };
  }

  async componentDidMount() {
    if (this.props.location.search) {
      var params = this.props.location.search.split("&");
      if (params.length > 0) {
        var code = params[0].split("=");
        if (code && code.length > 1) {
          console.log(code[1]);
        }
      }
    }
    ListActivityType().then((activityTypes) => {
      let activities = [{ Id: 0, Description: "All" }, ...activityTypes];
      this.setState({ activityTypes: activities });
    });

    listEquipmentTypes().then((equipmentTypes) => {
      let types = [{ Id: 0, Description: "All" }, ...equipmentTypes];
      this.setState({ equipmentType: types });
    });

    await this.listActiveBooking();

    var token = await userApiService.getUserFrameIOToken();

    if (!token) {
      console.log("token", token);
      this.setState({ displayFrameIOModal: true });
    }
  }

  loadUsage = async (start, end) => {
    let list = [...this.state.ActiveBooking];
    list.map(async (i) => {
      const currentUsage = await this.getGatewayUsage(i.GatewayId, start, end);
      i.TotalUsage = currentUsage.total_usage;
      i.CellUsage = currentUsage.cell_usage;
    });
    this.setState(
      {
        ActiveBooking: [],
      },
      () => {
        const me = this;
        setTimeout(function () {
          me.setState({
            ActiveBooking: list,
          });
        }, 500);
      }
    );
  };

  listActiveBooking = async () => {
    this.setState({ isLoading: true });
    const list = await ListActiveBooking();
    for (let i = 0; i <= list.length - 1; i++) {
      if (list[i].TypeId === 3 && list[i].GatewayId) {
        const currentUsage = await this.getGatewayUsage(
          list[i].GatewayId,
          `${list[i].BorrowedDateFromST} 00:00:00`,
          `${moment(new Date()).format("MM/DD/YYYY")} 23:59:59`
        );

        list[i].TotalUsage = currentUsage.total_usage;
        list[i].CellUsage = currentUsage.cell_usage;
        list[i].OtherUsage = currentUsage.total_usage - currentUsage.cell_usage;
      }

      if (list[i].TypeId === 1 && list[i].GatewayId) {
        const currentUsage = await GetSourceUsage(
          list[i].GatewayId,
          `${list[i].BorrowedDateFromST} 00:00:00`,
          `${moment(new Date()).format("MM/DD/YYYY")} 23:59:59`
        );

        list[i].TotalUsage = currentUsage.totalUsage;
        list[i].CellUsage = currentUsage.totalCellUsage;
        list[i].OtherUsage =
          currentUsage.totalUsage - currentUsage.totalCellUsage;
      }
      list[i].Name = list[i].Name || list[i].ServiceType;
    }
    this.setState({
      ActiveBooking: list,
      originalList: list,
      isLoading: false,
    });
  };

  getGatewayUsage = async (id, from, to) => {
    const result = await GetGatewayUsage(id, from, to);
    return result;
  };

  handleSelect = (e) => {
    this.setState({ selected: e.selected });
  };

  onServiceTypeChange = (e) => {
    this.setState({ displayEquipmentType: parseInt(e.target.value) === 1 });
  };

  onChange = (e) => {
    let targetName = e.target.name;
    this.setState(
      {
        [targetName]: e.target.value,
      },
      () => {
        let originalList = [...this.state.originalList];
        let sortby = [...this.sortBy];
        if (this.state.selectedSort === "asc") {
          originalList.sort((a, b) => {
            if (this.state.selectedSortBy === "Name") {
              if (a[this.state.selectedSortBy] < b[this.state.selectedSortBy]) {
                return -1;
              }
              if (a[this.state.selectedSortBy] > b[this.state.selectedSortBy]) {
                return 1;
              }
              return 0;
            } else if (
              this.state.selectedSortBy === "BorrowedDateFromST" ||
              this.state.selectedSortBy === "BorrowedDateToST"
            ) {
              if (
                moment(a[this.state.selectedSortBy]) <
                moment(b[this.state.selectedSortBy])
              ) {
                return -1;
              }
              if (
                moment(a[this.state.selectedSortBy]) >
                moment(b[this.state.selectedSortBy])
              ) {
                return 1;
              }
              return 0;
            } else if (
              this.state.selectedSortBy === "TotalUsage" ||
              this.state.selectedSortBy === "CellUsage" ||
              this.state.selectedSortBy === "OtherUsage"
            ) {
              if (
                parseFloat(a[this.state.selectedSortBy]) <
                parseFloat(b[this.state.selectedSortBy])
              ) {
                return -1;
              }
              if (
                parseFloat(a[this.state.selectedSortBy]) >
                parseFloat(b[this.state.selectedSortBy])
              ) {
                return 1;
              }
              return 0;
            }
          });
        } else {
          originalList.sort((a, b) => {
            if (this.state.selectedSortBy === "Name") {
              if (a[this.state.selectedSortBy] > b[this.state.selectedSortBy]) {
                return -1;
              }
              if (a[this.state.selectedSortBy] < b[this.state.selectedSortBy]) {
                return 1;
              }
              return 0;
            } else if (
              this.state.selectedSortBy === "BorrowedDateFromST" ||
              this.state.selectedSortBy === "BorrowedDateToST"
            ) {
              if (
                moment(a[this.state.selectedSortBy]) >
                moment(b[this.state.selectedSortBy])
              ) {
                return -1;
              }
              if (
                moment(a[this.state.selectedSortBy]) <
                moment(b[this.state.selectedSortBy])
              ) {
                return 1;
              }
              return 0;
            } else if (
              this.state.selectedSortBy === "TotalUsage" ||
              this.state.selectedSortBy === "CellUsage" ||
              this.state.selectedSortBy === "OtherUsage"
            ) {
              if (
                parseFloat(a[this.state.selectedSortBy]) >
                parseFloat(b[this.state.selectedSortBy])
              ) {
                return -1;
              }
              if (
                parseFloat(a[this.state.selectedSortBy]) <
                parseFloat(b[this.state.selectedSortBy])
              ) {
                return 1;
              }
              return 0;
            }
          });
        }

        if (parseInt(this.state.selectedServiceType) !== 0) {
          const equipmentType = parseInt(this.state.selectedEquipmentType);
          originalList = originalList.filter((item) => {
            return (
              item.ServiceTypeId === parseInt(this.state.selectedServiceType)
            );
          });

          if (equipmentType !== 0) {
            originalList = originalList.filter((item) => {
              return item.TypeId === parseInt(this.state.selectedEquipmentType);
            });

            if (equipmentType === 3) {
              sortby = [...this.sortByGateway];
            }
          }
        }

        this.setState({
          ActiveBooking: originalList.filter((booking) => {
            return booking.Name.toLowerCase().includes(
              this.state.searchText.toLocaleLowerCase()
            );
          }),
          sortby,
        });
      }
    );
  };

  viewDetails = async (booking) => {
    if (!$("#usagecontainer").is(":visible")) {
      this.props.history.push(
        `/usage/${booking.SalesId}/${booking.EquipmentId}`
      );
    } else {
      this.setState(
        {
          selectedSaleId: 0,
          selectedEquipmentId: 0,
        },
        () => {
          this.setState({
            selectedSaleId: booking.SalesId,
            selectedEquipmentId: booking.EquipmentId,
          });
        }
      );
    }
  };

  render() {
    return (
      <div className="container-fluid">
        <FmLoadingScreen isLoading={this.state.isLoading} />
        <div class="row mb-3">
          <div class="col-12">
            <button
              class="btn btn-primary float-right"
              onClick={() => {
                this.setState({ displayFrameIOModal: true });
              }}
            >
              Set Frame.io Token
            </button>
          </div>
        </div>
        <div class="row">
          {this.state.ActiveBooking.length > 0 ? (
            <>
              <div class="col-12 col-md-12 col-lg-6">
                <div class="row mb-3">
                  <div class="col-10">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Search here"
                      value={this.state.searchText}
                      onChange={this.onChange}
                      name="searchText"
                    />
                  </div>
                  <div class="col-2 pl-0">
                    <button
                      class="btn btn-primary w-100"
                      onClick={() =>
                        this.setState({
                          displayfilter: !this.state.displayfilter,
                        })
                      }
                    >
                      <i class="icon-filter_list"></i>
                    </button>
                  </div>
                </div>
                {this.state.displayfilter ? (
                  <div class="row mb-3">
                    <div class="col-12">
                      <label class="py-0 my-0">Service Type</label>
                      <select
                        class="form-control"
                        onChange={(e) => {
                          this.onChange(e);
                          this.onServiceTypeChange(e);
                        }}
                        name="selectedServiceType"
                        value={this.state.selectedServiceType}
                      >
                        {this.state.activityTypes.map((types) => (
                          <option value={types.Id}>{types.Description}</option>
                        ))}
                      </select>
                    </div>
                    {this.state.displayEquipmentType ? (
                      <div class="col-12 mt-1">
                        <label class="py-0 my-0">Equipment Type</label>
                        <select
                          class="form-control"
                          name="selectedEquipmentType"
                          onChange={this.onChange}
                          value={this.state.selectedEquipmentType}
                        >
                          {this.state.equipmentType.map((types) => (
                            <option value={types.Id}>
                              {types.Description}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : null}
                    <div class="col-6 mt-1">
                      <label class="py-0 my-0">Sort By</label>
                      <select
                        class="form-control"
                        name="selectedSortBy"
                        onChange={this.onChange}
                        value={this.state.selectedSortBy}
                      >
                        {this.state.sortby.map((types) => (
                          <option value={types.Id}>{types.Description}</option>
                        ))}
                      </select>
                    </div>
                    <div class="col-6 mt-1">
                      <label class="py-0 my-0">Sort</label>
                      <select
                        class="form-control"
                        name="selectedSort"
                        onChange={this.onChange}
                        value={this.state.selectedSort}
                      >
                        {this.state.sort.map((sort) => (
                          <option value={sort}>{sort}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : null}
                <div class="row">
                  {this.state.ActiveBooking.map((booking) => (
                    <div class="col-12 col-xl-6 col-lg-12 col-md-6 mb-2">
                      <div class="card shadow-sm">
                        <div class="card-body">
                          <h6 class="card-title py-0 my-0">
                            <i class="icon-tools"></i>{" "}
                            {booking.Name || booking.ServiceType}
                          </h6>
                          <label class="my-0 text-muted">
                            <i class="icon-calendar"></i>{" "}
                            {booking.BorrowedDateFromST} -{" "}
                            {booking.BorrowedDateToST}
                          </label>

                          {booking.TypeId === 1 || booking.TypeId === 3 ? (
                            <>
                              <div class="row mt-2">
                                <div class="col-4 text-center">
                                  <label class="w-100 font-weight-bold mb-0">
                                    {fileSizeConverter(booking.CellUsage)}
                                  </label>
                                  <label class="w-100 mt-0">
                                    <i class="icon-phone4"></i> Cell
                                  </label>
                                </div>
                                <div class="col-4 text-center">
                                  <label class="w-100 font-weight-bold mb-0">
                                    {fileSizeConverter(booking.OtherUsage)}
                                  </label>
                                  <label class="w-100 mt-0">
                                    <i class="icon-devices_other"></i> Other
                                  </label>
                                </div>
                                <div class="col-4 text-center">
                                  <label class="w-100 font-weight-bold mb-0">
                                    {fileSizeConverter(booking.TotalUsage)}
                                  </label>
                                  <label class="w-100 mt-0">
                                    <i class="icon-data_usage"></i> Total
                                  </label>
                                </div>
                              </div>
                              <button
                                class="btn btn-primary btn-sm float-right mt-3"
                                onClick={async () => {
                                  await this.viewDetails(booking);
                                }}
                              >
                                View Details <i class="icon-go mt-1"></i>
                              </button>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                id="usagecontainer"
                class="col-md-6 d-none d-sm-none d-md-none d-lg-block d-xl-block d-xxl-block"
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
                  <h1>
                    <i class="icon-broken_image"></i>
                  </h1>
                  <p>No active booking to display</p>
                </div>
              </div>
            </div>
          )}
          <FrameIOFormModal
            show={this.state.displayFrameIOModal}
            closeModal={() => {
              this.setState({
                displayFrameIOModal: false,
              });
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboardPage);
