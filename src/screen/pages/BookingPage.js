import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  listBooking,
  listBookingsEquipment,
  DeleteBooking,
  DeleteBookingEquipment,
} from "../../apiService/bookingAPI";

import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { filterBy, process } from "@progress/kendo-data-query";
import { Button } from "@progress/kendo-react-buttons";
import { ColumnMenu, ColumnMenuCheckboxFilter } from "../components/ColumnMenu";
import FmLoadingScreen from "../components/FmLoadingScreen";
import BookedEquipmentGrid from "./BookedEquipmentGrid";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { ListStatusTypes } from "../../apiService/lookUpAPI";
import { Container, Modal, Row, Table } from "react-bootstrap";
import moment from "moment";
import BookingFormPage from "./BookingFormPage";
import BookingDetails from "./BookingDetails";
import $ from "jquery";
import BookingDetailsModal from "./BookingDetailsModal";
import { FloatingLabel } from "@progress/kendo-react-labels";
import BookingTypeLabel from "../components/BookingTypeLabel";

class CustomCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: [],
    };
  }

  componentDidMount() {
    ListStatusTypes().then((result) => {
      this.setState({ status: result });
    });
  }

  render() {
    return (
      <td>
        <DropDownList
          data={this.state.status}
          textField="Description"
          filterable={true}
          onFilterChange={this.filterChange}
          style={{ width: "100%" }}
          value={{
            Id: this.props.dataItem.StatusId,
            Description: this.props.dataItem.Status,
          }}
          onChange={(e) => {
            // this.setState({
            //   booking: {
            //     ...this.state.booking,
            //     StatusId: e.value.Id,
            //   },
            // });
          }}
        />
      </td>
    );
  }
}

class BookingPage extends Component {
  constructor(props) {
    super(props);
    this.pageSize = [5, 10, 20, 25];
    this.state = {
      selectedBooking: {},
      showBookingModal: false,
      filter: {
        Take: 10,
        Skip: 0,
        Field: "",
        Direction: "",
        Searchs: [
          {
            Field: "ProjectName",
            Operator: "like",
            Value: "",
          },
          {
            Field: "CustomerName",
            Operator: "like",
            Value: "",
          },
        ],
      },
      data: [],
      totalCount: 0,
      dropdown: [],
      isLoading: false,
      windowSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      selectedSalesId: null,
      searchText: "",
      selectedSortBy: "SalesId",
      sortBy: [
        { Id: "SalesId", Description: "ID" },
        { Id: "ProjectName", Description: "Project Name" },
        { Id: "Status", Description: "Status" },
        { Id: "CustomerName", Description: "Customer Name" },
        { Id: "CreatedByUserName", Description: "Created By" },
        { Id: "CreatedDateString", Description: "Created Date" },
      ],
      selectedSort: "desc",
      sort: ["asc", "desc"],
      originalList: [],
    };
  }

  async componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions);
    if ($("#bookingGrid").is(":visible")) {
      await this.loadBookings();
    } else {
      await this.loadBookingCard();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  loadBookings = async () => {
    this.setState({ isLoading: true });
    var result = await listBooking(this.state.filter);
    this.setState({
      data: result.Data,
      totalCount: result.TotalCount,
      isLoading: false,
    });
  };

  loadBookingCard = async () => {
    this.setState({ isLoading: true });
    let start = true;
    let dataResult = [];
    let Skip = 0;
    while (start) {
      var result = await listBooking({
        ...this.state.filter,
        Skip,
      });
      dataResult.push(...result.Data);
      start = result.Data.length > 0;
      Skip += 10;
    }
    this.setState(
      {
        data: dataResult,
        originalList: dataResult,
        isLoading: false,
      },
      () => {
        this.filterList();
      }
    );
  };

  expandChange = async (event) => {
    event.dataItem.expanded = event.value;
    const bookedEquipment = await listBookingsEquipment(
      {
        Skip: 0,
        Take: 10,
      },
      event.dataItem.SalesId
    );
    console.log(bookedEquipment);
    let data = this.state.data.slice();
    let index = data.findIndex((d) => d.SalesId === event.dataItem.SalesId);
    data[index].details = bookedEquipment.Data;
    console.log(data);
    this.setState({ data: data });
  };

  MyCustomCell = (props) => <CustomCell {...props} myProp={this.customData} />;

  updateWindowDimensions = () => {
    this.setState({
      windowSize: { width: window.innerWidth, height: window.innerHeight },
    });
  };

  editRow = (dataItem) => {
    let showDetailsModal = false;
    if (!$("#bookingDetails").is(":visible")) {
      showDetailsModal = true;
    }
    console.log(dataItem);
    this.setState({
      selectedBooking: dataItem,
      selectedSalesId: dataItem.SalesId,
      showDetailsModal,
    });
  };

  toggleModal = () => {
    this.setState({
      showBookingModal: !this.state.showBookingModal,
      selectedBooking: {},
    });
  };

  searchEquipment = async (e) => {
    const searchText = e.target.value;
    const filter = this.state.filter;
    filter.Searchs.map((s) => {
      s.Value = searchText;
    });
    filter.Skip = 0;
    this.setState(
      {
        filter,
      },
      async () => {
        await this.loadBookings();
      }
    );
  };

  onSortChange = (e) => {
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      () => {
        this.filterList();
      }
    );
  };

  filterList = () => {
    const result = [...this.state.originalList];
    result.sort((a, b) => {
      let left, right;
      left =
        this.state.selectedSortBy !== "CreatedDateString"
          ? a[this.state.selectedSortBy]
          : moment(a[this.state.selectedSortBy]);
      right =
        this.state.selectedSortBy !== "CreatedDateString"
          ? b[this.state.selectedSortBy]
          : moment(b[this.state.selectedSortBy]);

      if (this.state.selectedSort === "asc") {
        if (left < right) {
          return -1;
        }
        if (left > right) {
          return 1;
        }
      } else {
        if (left > right) {
          return -1;
        }
        if (left < right) {
          return 1;
        }
      }
    });
    this.setState({
      data: result.filter(
        (eq) =>
          eq.SalesId.toString().includes(this.state.searchText.toLowerCase()) ||
          eq.ProjectName.toLowerCase().includes(
            this.state.searchText.toLowerCase()
          ) ||
          eq.Status.toLowerCase().includes(
            this.state.searchText.toLowerCase()
          ) ||
          eq.CustomerName.toLowerCase().includes(
            this.state.searchText.toLowerCase()
          ) ||
          eq.CreatedByUserName.toLowerCase().includes(
            this.state.searchText.toLowerCase()
          )
      ),
      isLoading: false,
    });
  };

  deleteBooking = async () => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      this.setState({
        isLoading: true,
      });
      await DeleteBooking(this.state.selectedSalesId);
      this.setState({ selectedSalesId: null });
      this.loadBookings();
    }
  };

  deleteBookingEquipment = async (saleEquipmentId) => {
    if (
      window.confirm("Are you sure you want to delete this booking equipment?")
    ) {
      this.setState({
        isLoading: true,
      });
      let selectedSalesId = this.state.selectedSalesId;
      await DeleteBookingEquipment(saleEquipmentId);
      this.setState({ selectedSalesId: null, isLoading: false }, () => {
        this.setState({ selectedSalesId });
      });
    }
  };

  render() {
    return (
      <div>
        <style>
          {`.k-grid-content{
          overflow: hidden !important
          .k-button{
            
          }
        }`}
        </style>

        <FmLoadingScreen isLoading={this.state.isLoading} />
        <div class="row">
          <div class="col-xxl-9 col-xl-8">
            <div class="row mx-1 mx-md-0 mx-lg-0 mb-2">
              <div class="col-lg-4 col-xl-4 col-md-6 col-9 px-md-0 px-lg-0">
                <h4>Bookings</h4>
              </div>
              <div class="col-lg-4 col-xl-4 col-md-6 col-3 px-md-0 px-lg-0 d-block d-sm-block d-md-none d-lg-none d-xl-none d-xxl-none">
                <Button
                  primary={true}
                  onClick={this.toggleModal}
                  className="w-100"
                >
                  <i
                    class="icon-document-add1 mr-1"
                    style={{ fontSize: 24 }}
                  ></i>
                </Button>
              </div>
              <div class="col-lg-8 col-xl-8 col-md-6 col-xs-12 d-none d-sm-none d-md-block d-lg-block d-xl-block d-xxl-block">
                <div class="row">
                  <div class="col-xl-10 col-md-8 text-right px-0">
                    <label class="mt-2 ">Page Size:</label>
                  </div>
                  <div class="col-xl-2 col-md-4 pl-0">
                    <select
                      class="form-control ml-1"
                      onChange={async (e) => {
                        this.setState(
                          {
                            filter: {
                              ...this.state.filter,
                              Take: e.target.value,
                            },
                          },
                          () => {
                            this.loadBookings();
                          }
                        );
                      }}
                    >
                      {this.pageSize.map((size) => (
                        <option
                          value={size}
                          selected={this.state.filter.Take === size}
                        >
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 shadow-sm px-md-0">
              <div
                class="w-100 p-3 border"
                style={{ backgroundColor: "white" }}
              >
                <div class="row">
                  <div class="col-12 col-md-8">
                    <div class="row">
                      <div class="col-xl-8">
                        <FloatingLabel
                          label={"Search:"}
                          editorId="search"
                          className="w-100"
                          editorPlaceholder="Search By Name"
                          // editorValue={this.state.equipment.Company}
                        >
                          <input
                            className="k-textbox"
                            id="search"
                            name="search"
                            placeholder="Search By Name"
                            onChange={async (e) => {
                              if ($("#bookingGrid").is(":visible")) {
                                await this.searchEquipment(e);
                              } else {
                                this.setState(
                                  { searchText: e.target.value },
                                  () => {
                                    this.filterList();
                                  }
                                );
                              }
                            }}
                          />
                        </FloatingLabel>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-md-4 d-none d-sm-none d-md-block d-lg-block d-xl-block d-xxl-block">
                    <div class="row d-flex justify-content-end">
                      <div class="col-lg-8 col-xl-10 col-xxl-6 float-right mt-3">
                        <Button
                          primary={true}
                          onClick={this.toggleModal}
                          className="float-right mt-3"
                        >
                          <i
                            class="icon-document-add1 mr-1"
                            style={{ fontSize: 24 }}
                          ></i>
                          New Bookings
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div class="mt-2 col-12 col-md-4 d-block d-sm-block d-md-none d-lg-none d-xl-none d-xxl-none">
                    <div class="row">
                      <div class="col-7">
                        <label>Sort By</label>
                        <select
                          class="form-control"
                          name="selectedSortBy"
                          value={this.state.selectedSortBy}
                          onChange={this.onSortChange}
                        >
                          {this.state.sortBy.map((sortBy) => (
                            <option value={sortBy.Id}>
                              {sortBy.Description}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div class="col-5">
                        <label>Sort</label>
                        <select
                          class="form-control"
                          name="selectedSort"
                          value={this.state.selectedSort}
                          onChange={this.onSortChange}
                        >
                          {this.state.sort.map((sort) => (
                            <option value={sort}>{sort}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                id="bookingGrid"
                class="d-none d-sm-none d-md-block d-lg-block d-xl-block d-xxl-block"
              >
                <Grid
                  data={this.state.data}
                  onRowClick={({ dataItem }) => {
                    this.editRow(dataItem);
                  }}
                  sortable={true}
                  pageable={true}
                  total={this.state.totalCount}
                  take={this.state.filter.Take}
                  skip={this.state.filter.Skip}
                  onPageChange={(e) => {
                    this.setState(
                      {
                        filter: {
                          ...this.state.filter,
                          Take: e.page.take,
                          Skip: e.page.skip,
                        },
                      },
                      async () => {
                        await this.loadBookings();
                      }
                    );
                  }}
                  onSortChange={(e) => {
                    console.log(e.sort);
                  }}
                >
                  <Column
                    field="SalesId"
                    title="ID"
                    filter={"text"}
                    width={100}
                    // columnMenu={ColumnMenu}
                  />
                  <Column
                    field="ProjectName"
                    title="Project Name"
                    filter={"text"}
                    // columnMenu={ColumnMenu}
                  />
                  <Column field="Status" cell={this.MyCustomCell} />
                  <Column
                    field="CustomerName"
                    title="Customer Name"
                    filter={"text"}
                    // columnMenu={ColumnMenu}
                  />
                  <Column
                    field="CreatedByUserName"
                    title="Created By"
                    filter={"text"}
                    // columnMenu={ColumnMenu}
                  />
                  <Column
                    field="CreatedDateString"
                    title="Created Date"
                    filter={"text"}
                    // columnMenu={ColumnMenu}
                  />
                </Grid>
              </div>
              <div class="d-block d-sm-none d-md-none d-lg-none d-xl-none d-xxl-none mt-2">
                {this.state.data.map((b) => (
                  <div class="card mb-1 shadow-sm">
                    <div class="card-body p-3 pb-1">
                      <div class="card-title">
                        <div class="row">
                          <div class="col-12 my-0 py-0">
                            <label class="m-0 p-0 float-left font-weight-bold small">
                              ID: {b.SalesId}
                            </label>
                            <label class="m-0 p-0 float-right font-weight-bold small">
                              <BookingTypeLabel Status={b.Status} />
                            </label>
                          </div>
                          <div class="col-12 my-0 py-0">
                            <label class="m-0 p-0 float-left font-weight-bold text-uppercase">
                              <i class="icon-film2"></i> {b.ProjectName}
                            </label>
                          </div>
                          <div class="col-12 my-0 py-0">
                            <label class="m-0 p-0 float-left">
                              <i class="icon-people_alt"></i> {b.CustomerName}
                            </label>
                          </div>
                          <div class="col-12 my-0 py-0">
                            <label class="m-0 p-0 float-left small">
                              <i class="icon-user"></i> {b.CreatedByUserName}
                            </label>
                            <label class="m-0 p-0 float-right small">
                              <i class="icon-calendar"></i>{" "}
                              {b.CreatedDateString}
                            </label>
                          </div>
                        </div>
                        <div class="row mt-2">
                          <div class="col-12">
                            <button
                              class="k-button k-primary float-right"
                              onClick={async () => {
                                await this.editRow(b);
                              }}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            id="bookingDetails"
            class="col-xxl-3 col-xl-4 d-none d-sm-none d-md-none d-lg-none d-xl-block d-xxl-block"
          >
            {this.state.selectedSalesId ? (
              <BookingDetails
                salesId={this.state.selectedSalesId}
                displayEditButton={true}
                onEditCallBack={() => {
                  this.setState({
                    showBookingModal: !this.state.showBookingModal,
                  });
                }}
                onRemoveCallBack={this.deleteBooking}
                onRemoveEquipmentCallBack={this.deleteBookingEquipment}
              />
            ) : (
              <div class="card shadow-sm">
                <div class="card-body">
                  <div class="row">
                    <div class="col-12 text-center">
                      <h1>
                        <i class="icon-files-empty"></i>
                      </h1>
                      <p>Please select an booking to view the details.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {this.state.showBookingModal ? (
          <BookingFormPage
            show={this.state.showBookingModal}
            handleClose={this.toggleModal}
            booking={this.state.selectedBooking}
            handleSuccess={async () => {
              const salesId = this.state.selectedSalesId;
              await this.loadBookings();
              this.setState(
                {
                  selectedSalesId: null,
                },
                () => {
                  this.setState({
                    selectedSalesId: salesId,
                  });
                }
              );
            }}
            onRemoveCallBack={this.deleteBooking}
            onRemoveEquipmentCallBack={this.deleteBookingEquipment}
          />
        ) : null}

        {this.state.selectedSalesId && this.state.showDetailsModal ? (
          <BookingDetailsModal
            salesId={this.state.selectedSalesId}
            show={this.state.showDetailsModal}
            displayEditButton={true}
            onHide={() => {
              this.setState({ showDetailsModal: !this.state.showDetailsModal });
            }}
            onEditCallBack={() => {
              this.setState({
                showDetailsModal: !this.state.showDetailsModal,
                showBookingModal: !this.state.showBookingModal,
              });
            }}
            onRemoveCallBack={this.deleteBooking}
            onRemoveEquipmentCallBack={this.deleteBookingEquipment}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BookingPage);
