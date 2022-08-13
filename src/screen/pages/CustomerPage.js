import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  listCustomers,
  ListAssignedUserByCustomerId,
} from "../../apiService/customerAPI";

import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { filterBy, process } from "@progress/kendo-data-query";
import { Button } from "@progress/kendo-react-buttons";
import { ColumnMenu, ColumnMenuCheckboxFilter } from "../components/ColumnMenu";
import FmLoadingScreen from "../components/FmLoadingScreen";
import CustomerFormPage from "./CustomerFormPage";
import CustomerUserGridDetail from "./CustomerUserGridDetail";
import { Card } from "react-bootstrap";
import moment from "moment";
import { generatePassword } from "../../utility";
import { CustomerDetail } from "./CustomerDetail";
import { FloatingLabel } from "@progress/kendo-react-labels";
import { CustomerDetailModal } from "./CustomerDetailModal";
import $ from "jquery";
import BookingDetailsModal from "./BookingDetailsModal";

class CustomerPage extends Component {
  constructor(props) {
    super(props);
    this.pageSize = [5, 10, 20, 25];
    this.state = {
      showNewEquipmentModal: false,
      filter: {
        Take: 10,
        Skip: 0,
        Field: "",
        Direction: "",
        Searchs: [
          {
            Field: "Name",
            Operator: "like",
            Value: "",
          },
        ],
      },
      sort: [],
      data: [],
      totalCount: 0,
      dropdown: [],
      isLoading: false,
      windowSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      selectedCustomer: {},
      showDetailsModal: false,

      searchText: "",
      selectedSortBy: "CustomerId",
      sortBy: [
        { Id: "CustomerId", Description: "ID" },
        { Id: "Name", Description: "Customer Name" },
        { Id: "Phone", Description: "Phone" },
        { Id: "Email", Description: "Email" },
        { Id: "CreatedBy", Description: "Created By" },
        { Id: "CreatedDateString", Description: "Created Date" },
      ],
      selectedSort: "desc",
      sort: ["asc", "desc"],
      originalList: [],
    };
  }

  async componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions);
    if ($("#customerGrid").is(":visible")) await this.loadCustomers();
    else await this.loadCustomersCard();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  loadCustomers = async () => {
    this.setState({ isLoading: true });
    var result = await listCustomers(this.state.filter);
    this.setState({
      data: result.Data,
      totalCount: result.TotalCount,
      isLoading: false,
    });
  };

  loadCustomersCard = async () => {
    this.setState({ isLoading: true });
    let start = true;
    let dataResult = [];
    let Skip = 0;
    while (start) {
      var result = await listCustomers({
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
          eq.CustomerId.toString().includes(
            this.state.searchText.toLowerCase()
          ) ||
          eq.Name.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
          eq.Phone.toLowerCase().includes(
            this.state.searchText.toLowerCase()
          ) ||
          eq.Email.toLowerCase().includes(
            this.state.searchText.toLowerCase()
          ) ||
          eq.CreatedBy.toLowerCase().includes(
            this.state.searchText.toLowerCase()
          )
      ),
      isLoading: false,
    });
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

  toggleDialog = () => {
    this.setState({
      showNewEquipmentModal: !this.state.showNewEquipmentModal,
      selectedCustomer: {
        CustomerId: 0,
        Name: "",
        Phone: "",
        Email: "",
        Address: "",
        CountryId: 0,
        ProvinceId: 0,
        City: "",
        PostalCode: "",
        CustomerUsers: [
          {
            FmUser: {
              FirstName: "",
              LastName: "",
              Username: "",
              Password: generatePassword(),
            },
          },
        ],
        selectedCountry: { Id: 0, Description: "" },
        selectedProvince: { Id: 0, Description: "" },
      },
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
        await this.loadCustomers();
      }
    );
  };

  expandChange = async (event) => {
    event.dataItem.expanded = event.value;
    const customerUser = await ListAssignedUserByCustomerId(
      event.dataItem.CustomerId
    );
    let data = this.state.data.slice();
    let index = data.findIndex(
      (d) => d.CustomerId === event.dataItem.CustomerId
    );
    data[index].details = customerUser;
    this.setState({ data: data });
  };

  updateWindowDimensions = () => {
    this.setState({
      windowSize: { width: window.innerWidth, height: window.innerHeight },
    });
  };

  onRowClick = (dataItem) => {
    let showDetailsModal = false;
    if (!$("#customerDetails").is(":visible")) {
      showDetailsModal = true;
    }
    this.setState({
      selectedCustomer: dataItem,
      showDetailsModal,
    });
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
            <div class="row  mx-1 mx-md-0 mx-lg-0 mb-2">
              <div class="col-lg-4 col-xl-4 col-md-6 col-9 px-md-0 px-lg-0">
                <h2>Customers</h2>
              </div>
              <div class="col-lg-4 col-xl-4 col-md-6 col-3 px-md-0 px-lg-0 d-block d-sm-block d-md-none d-lg-none d-xl-none d-xxl-none">
                <Button
                  primary={true}
                  onClick={this.toggleDialog}
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
                            this.loadCustomers();
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
                              if ($("#customerGrid").is(":visible")) {
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
                          onClick={this.toggleDialog}
                          className="float-right mt-3"
                        >
                          <i
                            class="icon-document-add1 mr-1"
                            style={{ fontSize: 24 }}
                          ></i>
                          New Customer
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
                id="customerGrid"
                class="d-none d-sm-none d-md-block d-lg-block d-xl-block d-xxl-block"
              >
                <Grid
                  data={this.state.data}
                  // {...this.state.data.dataState}
                  // filter={this.state.filter}
                  // onDataStateChange={(event) => {
                  //   this.setState({
                  //     data: createDataState(event.data),
                  //   });
                  // }}
                  // onFilterChange={(e) => {
                  //   this.setState({
                  //     filter: e.filter,
                  //   });
                  // }}
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
                        await this.loadCustomers();
                      }
                    );
                  }}
                  sort={this.state.sort}
                  onSortChange={(e) => {
                    this.setState(
                      {
                        sort: e.sort,
                        filter: {
                          ...this.state.filter,
                          Field: e.sort.length > 0 ? e.sort[0].field : "",
                          Direction: e.sort.length > 0 ? e.sort[0].dir : "",
                        },
                      },
                      async () => {
                        await this.loadCustomers();
                      }
                    );
                  }}
                  // detail={CustomerUserGridDetail}
                  // expandField="expanded"
                  // onExpandChange={this.expandChange}
                  onRowClick={({ dataItem }) => {
                    this.onRowClick(dataItem);
                  }}
                >
                  <Column
                    field="CustomerId"
                    title="Customer Id"
                    filter={"text"}
                    // columnMenu={ColumnMenu}
                  />
                  <Column
                    field="Name"
                    title="Name"
                    filter={"text"}
                    // columnMenu={ColumnMenu}
                  />
                  <Column
                    field="Phone"
                    title="Phone"
                    filter={"text"}
                    // columnMenu={ColumnMenu}
                  />
                  <Column
                    field="Email"
                    title="Email"
                    filter={"text"}
                    // columnMenu={ColumnMenu}
                  />
                  <Column
                    field="CreatedBy"
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
                {this.state.data.map((c) => (
                  <div class="card mb-1 shadow-sm">
                    <div class="card-body p-3 pb-1">
                      <div class="card-title">
                        <div class="row">
                          <div class="col-12 my-0 py-0">
                            <label class="m-0 p-0 float-left font-weight-bold small">
                              ID: {c.CustomerId}
                            </label>
                          </div>
                          <div class="col-12 my-0 py-0">
                            <label class="m-0 p-0 float-left font-weight-bold text-uppercase">
                              <i class="icon-users"></i> {c.Name}
                            </label>
                          </div>
                          <div class="col-12 my-0 py-0">
                            <label class="m-0 p-0 float-left small">
                              <i class="icon-phone3"></i> {c.Phone}
                            </label>
                          </div>
                          <div class="col-12 my-0 py-0">
                            <label class="m-0 p-0 float-left small">
                              <i class="icon-email"></i> {c.Email}
                            </label>
                          </div>
                          <div class="col-12 my-0 py-0">
                            <label class="m-0 p-0 float-left small">
                              <i class="icon-user"></i> {c.CreatedBy}
                            </label>
                            <label class="m-0 p-0 float-right small">
                              <i class="icon-calendar"></i>{" "}
                              {c.CreatedDateString}
                            </label>
                          </div>
                        </div>
                        <div class="row mt-2">
                          <div class="col-12">
                            <button
                              class="k-button k-primary float-right"
                              onClick={async () => {
                                this.onRowClick(c);
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
            id="customerDetails"
            class="col-xxl-3 col-xl-4 d-none d-sm-none d-md-none d-lg-none d-xl-block d-xxl-block"
          >
            {this.state.selectedCustomer.CustomerId ? (
              <CustomerDetail
                selectedCustomer={this.state.selectedCustomer}
                displayEditButton={true}
                onEditCallBack={() => {
                  this.setState({ showNewEquipmentModal: true });
                }}
              />
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
        {this.state.showNewEquipmentModal ? (
          <CustomerFormPage
            onClose={this.toggleDialog}
            onSubmitSuccess={async () => {
              await this.loadCustomers();
            }}
            show={this.state.showNewEquipmentModal}
            selectedCustomer={this.state.selectedCustomer}
          />
        ) : null}

        {this.state.selectedCustomer.CustomerId &&
        this.state.showDetailsModal ? (
          <CustomerDetailModal
            show={this.state.showDetailsModal}
            selectedCustomer={this.state.selectedCustomer}
            displayEditButton={true}
            onHide={() => {
              this.setState({ showDetailsModal: !this.state.showDetailsModal });
            }}
            onEditCallBack={() => {
              this.setState({
                showDetailsModal: !this.state.showDetailsModal,
                showNewEquipmentModal: !this.state.showNewEquipmentModal,
              });
            }}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerPage);
