import { DatePicker } from "@progress/kendo-react-dateinputs";
import React, { Component } from "react";
import { connect } from "react-redux";
import { ListGateways } from "../../apiService/equipmentAPI";
import moment from "moment";
import FmLoadingScreen from "../components/FmLoadingScreen";
import $ from "jquery";
import { FmConfirmationModal } from "../components/FmConfirmationModal";
import { AutoComplete } from "@progress/kendo-react-dropdowns";
import GatewayDetailsCard from "../components/screens/GatewayDetailsCard";
import UsageDetailsCard from "../components/screens/UsageDetailsCard";
import { UsageDetailsModal } from "../components/modals/UsageDetailsModal";

class EquipmentUsagePage extends Component {
  constructor(props) {
    super(props);
    this.originalList = [];
    this.state = {
      selectedDate: new Date(),
      fromDate: new Date(),
      fromTime: new Date("1/1/2020 00:00:00"),
      toDate: new Date(),
      toTime: new Date(`1/1/2020 ${moment(new Date()).format("HH")}:00:00`),
      fromMinDate: new Date(),
      fromMaxDate: new Date(),
      toMinDate: new Date(),
      toMaxDate: new Date(),
      gateways: [],
      isLoading: false,
      selectedEquipment: {},
      categoryText: "",
      sortBy: [
        { id: "TotalCellUsage", description: "Cell Usage" },
        { id: "OtherUsage", description: "Other Usage" },
        { id: "TotalUsage", description: "Total Usage" },
      ],
      selectedSortBy: "TotalUsage",
      sort: ["asc", "desc"],
      selectedSort: "desc",
      searchText: "",
      confirmationOption: {
        show: false,
        onHide: null,
        title: "",
        message: "",
        onNo: null,
        onYes: null,
      },
      displayFilter:
        "d-none d-sm-none d-md-block d-lg-block d-xl-block d-xxl-block",
      autoCompleteList: [],
      isGraphMaximize: false,
      reRenderGraph: true,
    };
  }

  componentDidMount() {
    const currentDate = new Date();
    let dateFrom = new Date(moment(new Date()).subtract(44, "d"));
    this.setState(
      {
        fromDate: new Date(`1/1/${new Date().getFullYear()}`),
        fromMaxDate: currentDate,
        fromMinDate: dateFrom,
        toMaxDate: currentDate,
        toMinDate: dateFrom,
      },
      async () => {
        await this.loadGateways();
      }
    );
  }

  loadGatewaysOnFilter = async () => {
    if (
      moment(this.state.toDate).diff(moment(this.state.fromDate), "days") > 365
    ) {
      this.showConfirmation(
        "Confirm",
        "The selected Date is more than 365 days. this might take a while to load. Do you want to proceed?",
        this.loadGateways,
        () => {}
      );
    } else {
      await this.loadGateways();
    }
  };

  loadGateways = async () => {
    const fromDateTime = `${moment(this.state.fromDate).format(
      "MM/DD/YYYY"
    )} 00:00:00`;
    const toDateTime = `${moment(this.state.toDate).add(1,"days").format(
      "MM/DD/YYYY"
    )} 00:00:00`;
    this.setState({ isLoading: true });
    let gateways = await ListGateways(fromDateTime, toDateTime);
    this.originalList = gateways;
    gateways = this.sortSearch();
    let autoCompleteList = gateways.map((i) => i.Name);
    this.setState({
      gateways,
      isLoading: false,
      autoCompleteList,
    });
  };

  sortSearch = () => {
    if (this.state.selectedSort === "asc")
      this.originalList.sort(
        (a, b) => a[this.state.selectedSortBy] - b[this.state.selectedSortBy]
      );
    else {
      this.originalList.sort((a, b) => {
        return b[this.state.selectedSortBy] - a[this.state.selectedSortBy];
      });
    }
    return this.originalList.filter((gateway) => {
      return gateway.Name.toLowerCase().includes(
        this.state.searchText.toLowerCase()
      );
    });
  };

  onChange = (e) => {
    let targetName = e.target.name;
    this.setState(
      {
        [targetName]: e.target.value,
      },
      async () => {
        if (
          targetName !== "selectedDate" &&
          targetName !== "fromTime" &&
          targetName !== "toTime"
        ) {
          this.adjustMinAndMax(targetName);
          if (targetName === "fromDate" || targetName === "toDate")
            await this.loadGatewaysOnFilter();
          else {
            this.setState({ gateways: [] }, () => {
              this.setState({ gateways: this.sortSearch() });
            });
          }
        }
      }
    );
  };

  adjustMinAndMax = (targetName) => {
    // if (targetName === "fromDate") {
    //   this.setState({
    //     toMinDate: this.state.fromDate,
    //   });
    // } else {
    //   this.setState({
    //     fromMaxDate: this.state.toDate,
    //   });
    // }
    // if (moment(this.state.selectedDate) > moment(this.state.toDate)) {
    //   this.setState({ selectedDate: this.state.toDate });
    // }
  };

  onViewDetails = async (equipment) => {
    this.setState({ selectedEquipment: equipment });
    const isChartVisible = $("#displayedChart").is(":visible");
    if (!isChartVisible) {
      this.setState({ displayGraph: true });
    }
  };

  closeModal = () => {
    this.setState({
      displayGraph: !this.state.displayGraph,
    });
  };

  showConfirmation = (title, message, onConfirmCallback, onCancelCallBack) => {
    this.setState({
      confirmationOption: {
        show: true,
        onHide: () => {
          this.setState({
            confirmationOption: {
              ...this.state.confirmationOption,
              show: false,
            },
          });
        },
        title: title,
        message: message,
        onNo: onCancelCallBack,
        onYes: onConfirmCallback,
      },
    });
  };

  searchAutoComplete = ({ value }) => {
    let originalList = [...this.originalList];
    this.setState(
      {
        autoCompleteList: originalList
          .filter((gateway) => {
            return gateway.Name.toLowerCase().includes(value.toLowerCase());
          })
          .map((i) => i.Name),
        searchText: value,
      },
      () => {
        this.setState({
          gateways: this.sortSearch(),
        });
      }
    );
  };

  render() {
    return (
      <div class="">
        <FmLoadingScreen isLoading={this.state.isLoading} />
        <FmConfirmationModal options={this.state.confirmationOption} />
        <div class="row">
          <div class="col-12">
            <h4>Gateway Usage</h4>
          </div>
          <div
            class={`col-lg-12 col-xl-6 col-xxl-6 ${
              this.state.isGraphMaximize ? "d-none" : ""
            }`}
          >
            <div class="row mr-0 ml-0">
              <div
                class="col-12 py-3 pl-3 shadow-sm"
                style={{ backgroundColor: "white" }}
              >
                <div class="row mx-1">
                  <div class="col-8 col-md-12 col-xxl-12 col-xl-12 mb-3 px-0">
                    <label class="font-weight-bold d-none d-sm-none d-md-block d-lg-block d-xl-block d-xxl-block">
                      Search Equipment:
                    </label>
                    <AutoComplete
                      className="w-100"
                      onChange={this.searchAutoComplete}
                      data={this.state.autoCompleteList}
                    />
                  </div>
                  <div class="d-block d-sm-block d-md-none d-lg-none d-xl-none d-xxl-none col-4">
                    <button
                      class="btn btn-primary w-100"
                      onClick={() => {
                        this.setState({
                          displayFilter:
                            this.state.displayFilter !== ""
                              ? ""
                              : "d-none d-sm-none d-md-block d-lg-block d-xl-block d-xxl-block",
                        });
                      }}
                    >
                      <i class="icon-filter"></i>
                    </button>
                  </div>
                  <div
                    class={`${this.state.displayFilter} col-md-12 col-xxl-12 col-xl-12 mb-3 px-0 px-md-2`}
                  >
                    <div class="row">
                      <div class="col-6 col-md-3 col-xxl-3 col-xl-3">
                        <label class="font-weight-bold">Sort By:</label>
                        <select
                          class="form-control"
                          name="selectedSortBy"
                          onChange={this.onChange}
                          value={this.state.selectedSortBy}
                        >
                          {this.state.sortBy.map((sb) => (
                            <option value={sb.id}>{sb.description}</option>
                          ))}
                        </select>
                      </div>
                      <div class="col-6 col-md-3 col-xxl-3 col-xl-3">
                        <label class="font-weight-bold">Sort:</label>
                        <select
                          class="form-control"
                          name="selectedSort"
                          onChange={this.onChange}
                          value={this.state.selectedSort}
                        >
                          {this.state.sort.map((s) => (
                            <option value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div class="col-6 col-md-3 col-xxl-3 col-xl-3">
                        <label class="font-weight-bold">From:</label>
                        <DatePicker
                          className="w-100"
                          value={this.state.fromDate}
                          name="fromDate"
                          onChange={this.onChange}
                          max={this.state.toDate}
                        />
                      </div>
                      <div class="col-6 col-md-3 col-xxl-3 col-xl-3">
                        <label class="font-weight-bold">To:</label>
                        <DatePicker
                          className="w-100"
                          value={this.state.toDate}
                          name="toDate"
                          onChange={this.onChange}
                          max={new Date()}
                          min={this.state.fromDate}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row py-3">
              {this.state.gateways.map((gateway) => (
                <div class="col-xxl-6 col-xl-12 col-lg-6 mb-4">
                  <GatewayDetailsCard
                    gateway={gateway}
                    onViewDetails={async () => {
                      await this.onViewDetails(gateway);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div
            id="displayedChart"
            class={`col-lg-12 ${
              this.state.isGraphMaximize
                ? "col-xl-12 col-xxl-12"
                : "col-xl-6 col-xxl-6"
            }  d-none d-sm-none d-md-none d-lg-none d-xl-block d-xxl-block`}
          >
            <div class="row">
              <div class="col-12 mb-3">
                <button
                  class="float-right btn btn-primary"
                  onClick={() => {
                    this.setState(
                      {
                        isGraphMaximize: !this.state.isGraphMaximize,
                        reRenderGraph: false,
                      },
                      () => {
                        this.setState({
                          reRenderGraph: true,
                        });
                      }
                    );
                  }}
                >
                  <i
                    class={
                      !this.state.isGraphMaximize
                        ? "icon-maximize"
                        : "icon-shrink2"
                    }
                  ></i>
                </button>
              </div>
            </div>
            {this.state.reRenderGraph ? (
              <UsageDetailsCard
                selectedEquipment={this.state.selectedEquipment}
                selectedDate={this.state.selectedDate}
                fromDate={this.state.fromDate}
                fromTime={this.state.fromTime}
                toDate={this.state.toDate}
                toTime={this.state.toTime}
                onChange={this.onChange}
              />
            ) : null}
          </div>
        </div>
        <UsageDetailsModal
          displayGraph={this.state.displayGraph}
          closeModal={this.closeModal}
          selectedEquipment={this.state.selectedEquipment}
          selectedDate={this.state.selectedDate}
          fromDate={this.state.fromDate}
          fromTime={this.state.fromTime}
          toDate={this.state.toDate}
          toTime={this.state.toTime}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentUsagePage);
