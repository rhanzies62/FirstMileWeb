import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { listUsers } from "../../apiService/userAPI";

import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { filterBy, process } from "@progress/kendo-data-query";
import { Button } from "@progress/kendo-react-buttons";
import { ColumnMenu, ColumnMenuCheckboxFilter } from "../components/ColumnMenu";
import FmLoadingScreen from "../components/FmLoadingScreen";
import CustomerFormPage from "./CustomerFormPage";
import UserFormModal from "./UserFormModal";
import $ from "jquery";
import moment from "moment";

class UserPage extends Component {
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
            Field: "FirstName",
            Operator: "like",
            Value: "",
          },
          {
            Field: "LastName",
            Operator: "like",
            Value: "",
          },
          {
            Field: "Username",
            Operator: "like",
            Value: "",
          },
          {
            Field: "Email",
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

      searchText: "",
      selectedSortBy: "UserId",
      sortBy: [
        { Id: "UserId", Description: "ID" },
        { Id: "FirstName", Description: "First Name" },
        { Id: "LastName", Description: "Last Name" },
        { Id: "Username", Description: "Username" },
        { Id: "Email", Description: "Email" },
        { Id: "ContactNumber", Description: "Contact Number" },
      ],
      selectedSort: "desc",
      sort: ["asc", "desc"],
      originalList: [],
    };
  }

  async componentDidMount() {
    if ($("#userGrid").is(":visible")) await this.loadUsers();
    else await this.loadCustomersCard();
  }

  loadUsers = async () => {
    this.setState({ isLoading: true });
    var result = await listUsers(this.state.filter);
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
      var result = await listUsers({
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

  toggleDialog = () => {
    this.setState({
      showNewEquipmentModal: !this.state.showNewEquipmentModal,
    });
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
          eq.UserId.toString().includes(this.state.searchText.toLowerCase()) ||
          eq.FirstName.toLowerCase().includes(
            this.state.searchText.toLowerCase()
          ) ||
          eq.LastName.toLowerCase().includes(
            this.state.searchText.toLowerCase()
          ) ||
          eq.Username.toLowerCase().includes(
            this.state.searchText.toLowerCase()
          )
      ),
      isLoading: false,
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
        await this.loadUsers();
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
          <div class="col-12">
            <div class="row mx-1 mx-md-0 mx-lg-0 mb-2">
              <div class="col-lg-4 col-xl-4 col-md-6 col-9 px-md-0 px-lg-0">
                <h2>User</h2>
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
                            this.loadUsers();
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
                        <label class="form-label">Search</label>
                        <input
                          className="form-control"
                          id="search"
                          name="search"
                          placeholder="Search By Name"
                          onChange={async (e) => {
                            if ($("#userGrid").is(":visible")) {
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
                          New User
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
                id="userGrid"
                class="d-none d-sm-none d-md-block d-lg-block d-xl-block d-xxl-block"
              >
                <Grid
                  data={this.state.data}
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
                        await this.loadUsers();
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
                        await this.loadUsers();
                      }
                    );
                  }}
                >
                  <Column field="UserId" title="User Id" filter={"text"} />
                  <Column
                    field="FirstName"
                    title="First Name"
                    filter={"text"}
                  />
                  <Column field="LastName" title="Last Name" filter={"text"} />
                  <Column field="Username" title="Username" filter={"text"} />
                  <Column field="UserType" title="UserType" filter={"text"} />
                  <Column field="Email" title="Email" filter={"text"} />
                  <Column
                    field="ContactNumber"
                    title="Contact Number"
                    filter={"text"}
                  />
                  <Column
                    field="FullAddress"
                    title="Full Address"
                    filter={"text"}
                  />
                </Grid>
              </div>
              <div class="d-block d-sm-none d-md-none d-lg-none d-xl-none d-xxl-none mt-2">
                {this.state.data.map((u) => (
                  <div class="card mb-1 shadow-sm">
                    <div class="card-body p-3 pb-1">
                      <div class="card-title">
                        <div class="row">
                          <div class="col-12 my-0 py-0">
                            <label class="m-0 p-0 float-left font-weight-bold small">
                              ID: {u.UserId}
                            </label>
                            <label class="m-0 p-0 float-right font-weight-bold small">
                              <i class="icon-user3"></i> {u.UserType}
                            </label>
                          </div>
                          <div class="col-12 my-0 py-0">
                            <label class="m-0 p-0 float-left font-weight-bold text-uppercase">
                              <i class="icon-business-card"></i> {u.FirstName}{" "}
                              {u.LastName}
                            </label>
                          </div>
                          <div class="col-12 my-0 py-0">
                            <label class="m-0 p-0 float-left">
                              <i class="icon-key3"></i> {u.Username}
                            </label>
                          </div>
                          {u.Email ? (
                            <div class="col-12 my-0 py-0">
                              <label class="m-0 p-0 float-left">
                                <i class="icon-email"></i> {u.Email}
                              </label>
                            </div>
                          ) : null}

                          {u.ContactNumber ? (
                            <div class="col-12 my-0 py-0">
                              <label class="m-0 p-0 float-left small">
                                <i class="icon-phone3"></i> {u.ContactNumber}
                              </label>
                            </div>
                          ) : null}
                        </div>
                        <div class="row mt-2">
                          <div class="col-12">
                            <button
                              class="k-button k-primary float-right"
                              onClick={async () => {}}
                            >
                              <i class="icon-pencil mr-1"></i> Edit
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
        </div>

        {this.state.showNewEquipmentModal ? (
          <UserFormModal
            show={this.state.showNewEquipmentModal}
            onClose={this.toggleDialog}
            onSubmitSuccess={this.loadUsers}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
