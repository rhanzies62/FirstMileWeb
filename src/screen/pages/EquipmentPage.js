import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { filterBy, process } from "@progress/kendo-data-query";
import { Button } from "@progress/kendo-react-buttons";
import { ColumnMenu, ColumnMenuCheckboxFilter } from "../components/ColumnMenu";
import { Window } from "@progress/kendo-react-dialogs";
import { FloatingLabel } from "@progress/kendo-react-labels";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { listEquipment, createEquipment } from "../../apiService/equipmentAPI";
import {
  listEquipmentTypes,
  GetGatewayBySerial,
  GetSourceBySerial,
  GetGatewayLocation,
  GetSourceLocation,
  GetGatewayUsage,
  GetSourceUsage,
} from "../../apiService/lookUpAPI";
import { ListEquipmentBooking } from "../../apiService/bookingAPI";
import FmLoadingScreen from "../components/FmLoadingScreen";
import { Alert, Card, Form, Modal, OverlayTrigger } from "react-bootstrap";
import FmTextInput from "../components/FmTextInput";
import GoogleMapReact from "google-map-react";
import moment from "moment";
import Marker from "../components/Marker";
import Tooltip from "react-bootstrap/Tooltip";
import { fileSizeConverter } from "../../commonService";
import BookingDetailsModal from "./BookingDetailsModal";
import { EquipmentDetails } from "./EquipmentDetails";
import { EquipmentDetailModal } from "./EquipmentDetailModal";
import $ from "jquery";
import { FloatingButton, Item } from "react-floating-button";
import addIcon from "../../img/add.png";

const ADJUST_PADDING = 4;
const COLUMN_MIN = 4;

const columns = [
  { field: "EquipmentId", title: "ID", minWidnt: 50 },
  { field: "Name", title: "Name", minWidnt: 180 },
  { field: "Serial", title: "Serial", minWidnt: 125 },
  { field: "Type", title: "Type", minWidnt: 125 },
  { field: "Company", title: "Company", minWidnt: 125 },
];

class EquipmentPage extends Component {
  constructor(props) {
    super(props);
    this.minGridWidth = 0;
    this.pageSize = [5, 10, 20, 25];
    this.initialEquipment = {
      EquipmentId: 0,
      Name: "",
      Type: 0,
      Company: "",
      Description: "",
      Serial: "",
      GatewayId: "",
      TypeDescription: "",
      IsActive: true,
    };
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
          {
            Field: "Serial",
            Operator: "like",
            Value: "",
          },
          {
            Field: "Type",
            Operator: "like",
            Value: "",
          },
          {
            Field: "Company",
            Operator: "like",
            Value: "",
          },
        ],
      },
      sort: [],
      data: [],
      totalCount: 0,
      dropdown: [],
      equipment: this.initialEquipment,
      isLoading: false,
      isModalLoading: false,
      error: {
        IsSuccess: true,
        Message: "",
        windowHeight: 650,
      },
      isGateway: false,
      windowSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      setMinWidth: false,
      gridCurrent: 0,
      equipmentHistory: [],
      location: {},
      selectedSalesId: null,
      showDetailsModal: false,
      showEquipmentDetailsModal: false,
      searchText: "",
      selectedSortBy: "EquipmentId",
      sortBy: [
        { Id: "EquipmentId", Description: "ID" },
        { Id: "Type", Description: "Type" },
        { Id: "Name", Description: "Name" },
      ],
      selectedSort: "desc",
      sorts: ["asc", "desc"],
      originalList: [],
    };
  }

  async componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions);
    listEquipmentTypes().then((result) => {
      this.setState({ dropdown: result });
    });
    const self = this;
    if ($("#equipmentGrid").is(":visible")) {
      setTimeout(async () => {
        await self.loadEquipments();
        self.grid = document.querySelector(".k-grid");
        columns.map((item) => (self.minGridWidth += item.minWidnt));
        self.setState({
          gridCurrent: self.grid.offsetWidth,
          setMinWidth: self.grid.offsetWidth < self.minGridWidth,
        });
      }, 500);
    } else {
      await this.loadEquipmentCard();
    }
  }

  handleResize = () => {
    if (this.grid.offsetWidth < this.minGridWidth && !this.state.setMinWidth) {
      this.setState({
        setMinWidth: true,
      });
    } else if (this.grid.offsetWidth > this.minGridWidth) {
      this.setState({
        gridCurrent: this.grid.offsetWidth,
        setMinWidth: false,
      });
    }
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  loadEquipmentCard = async () => {
    this.setState({ isLoading: true });
    let start = true;
    let dataResult = [];
    let Skip = 0;
    while (start) {
      var result = await listEquipment({
        ...this.state.filter,
        Skip,
      });
      dataResult.push(...result.Data);
      start = result.Data.length > 0;
      Skip += 10;
    }
    console.log(dataResult);
    this.setState({
      data: dataResult,
      originalList: dataResult,
      isLoading: false,
    });
  };

  loadEquipments = async () => {
    this.setState({ isLoading: true });
    var result = await listEquipment(this.state.filter);
    this.setState({
      data: result.Data,
      totalCount: result.TotalCount,
      isLoading: false,
    });
  };

  onChange = (e) => {
    let eq = {
      ...this.state.equipment,
      [e.target.name]: e.target.value,
    };
    if (e.target.name === "Serial") {
      eq.Name = "";
      eq.GatewayId = "";
    }
    this.setState({
      equipment: eq,
    });
  };

  toggleDialog = () => {
    this.setState({
      equipment: this.initialEquipment,
      showNewEquipmentModal: !this.state.showNewEquipmentModal,
      error: {
        IsSuccess: true,
        Message: "",
        windowHeight: 650,
      },
      isGateway: false,
    });
  };

  searchGateway = async () => {
    let result = {};
    this.setState({ isModalLoading: true });
    if (this.state.equipment.TypeId === 1) {
      result = await GetSourceBySerial(this.state.equipment.Serial, "ENGO");
    }
    if (this.state.equipment.TypeId === 3) {
      result = await GetGatewayBySerial(this.state.equipment.Serial);
    }

    if (result.id === 0) {
      this.setState({
        isModalLoading: false,
        error: {
          IsSuccess: false,
          Message: "Serial number not found",
          windowHeight: 700,
        },
      });
    } else {
      this.setState({
        isModalLoading: false,
        equipment: {
          ...this.state.equipment,
          GatewayId: result.id,
          Name: result.name,
        },
      });
    }
  };

  filterChange = (event) => {};

  addEditEquipment = async () => {
    var result = await createEquipment(this.state.equipment);
    return result;
  };

  onCreateEquipmentClick = async () => {
    this.setState({ isModalLoading: true });
    var result = await this.addEditEquipment(this.state.equipment);
    if (result.IsSuccess) {
      this.toggleDialog();
      if ($("#equipmentGrid").is(":visible")) {
        this.loadEquipments();
      } else {
        this.loadEquipmentCard();
      }
      this.setState({
        isModalLoading: false,
        showEquipmentDetailsModal: false,
      });
    } else {
      this.setState({
        error: {
          IsSuccess: result.IsSuccess,
          Message: result.Message,
          windowHeight: 700,
        },
        isModalLoading: false,
      });
    }
  };

  updateWindowDimensions = () => {
    this.setState({
      windowSize: { width: window.innerWidth, height: window.innerHeight },
    });
  };

  closeModal = () => {
    this.setState({
      showNewEquipmentModal: !this.state.showNewEquipmentModal,
    });
  };

  setEquipmentModel = (dataItem) => {
    return {
      EquipmentId: dataItem.EquipmentId,
      Name: dataItem.Name,
      TypeId: dataItem.TypeId,
      Company: dataItem.Company,
      Description: dataItem.Description,
      Serial: dataItem.Serial,
      GatewayId: dataItem.GatewayId,
      TypeDescription: dataItem.Type,
      IsActive: dataItem.IsActive,
      Type: dataItem.Type,
      Username: dataItem.Username,
      CreatedDate: dataItem.CreatedDate,
      UpdatedDate: dataItem.UpdatedDate,
      UpdatedByUsername: dataItem.UpdatedByUsername,
    };
  };

  editRow = async (dataItem) => {
    this.setState({ isLoading: true });
    const self = this;
    const equipmentHistory = await ListEquipmentBooking(dataItem.EquipmentId);
    let location = {};
    this.setState({ equipment: {} });
    if (dataItem.TypeId === 1)
      location = await GetSourceLocation(dataItem.GatewayId);
    if (dataItem.TypeId === 3)
      location = await GetGatewayLocation(dataItem.GatewayId);

    this.setState(
      {
        equipment: this.setEquipmentModel(dataItem),
        equipmentHistory,
        isGateway: dataItem.TypeId === 3 || dataItem.TypeId === 1,
        error: {
          IsSuccess: true,
          Message: "",
          windowHeight: 650,
        },
        location,
        isLoading: false,
        showEquipmentDetailsModal: !$("#equipmentDetails").is(":visible"),
      },
      () => {
        this.state.equipmentHistory.map(async (history) => {
          await self.renderUsage(history, dataItem.GatewayId,dataItem.TypeId);
        });
      }
    );
  };

  removeRestoreEquipment = async (dataItem) => {
    if (
      window.confirm(
        `Are you sure you wish to ${
          dataItem.IsActive ? "delete" : "restore"
        } this equipment?`
      )
    ) {
      this.setState(
        {
          equipment: this.setEquipmentModel({
            ...dataItem,
            IsActive: !dataItem.IsActive,
          }),
        },
        async () => {
          let result = await this.addEditEquipment();
          if (result.IsSuccess) this.loadEquipments();
        }
      );
    }
  };

  rowRender = (trElement, props) => {
    const trProps = {
      className: props.dataItem.IsActive ? "" : "table-danger",
    };
    return React.cloneElement(
      trElement,
      { ...trProps },
      trElement.props.children
    );
  };

  setWidth = (minWidth) => {
    let width = this.state.setMinWidth
      ? minWidth
      : minWidth +
        (this.state.gridCurrent - this.minGridWidth) / columns.length;
    width = width < COLUMN_MIN ? width : (width -= ADJUST_PADDING);
    return width;
  };

  searchEquipment = async (e) => {
    const searchText = e.target.value;
    if ($("#equipmentGrid").is(":visible")) {
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
          await this.loadEquipments();
        }
      );
    } else {
      this.setState({ searchText }, () => {
        this.filterList();
      });
    }
  };

  renderUsage = async (history, gatewayId, typeId) => {
    if (gatewayId) {
      const from = moment(history.BorrowedDateFrom);
      const to = moment(history.BorrowedDateTo);
      const currentDate = moment(new Date());
      const equipmentHistory = [...this.state.equipmentHistory];
      const stateHistory = equipmentHistory.find((i) => history === i);
      if (stateHistory) {
        const fromDate = `${from.format("MM/DD/YYYY")} 00:00:00`;
        const toDate =
          currentDate > to
            ? `${to.format("MM/DD/YYYY")} 23:59:00`
            : `${currentDate.format("MM/DD/YYYY")} 23:59:00`;
        if (typeId === 1) {
          const data = await GetSourceUsage(gatewayId, fromDate, toDate);
          stateHistory.totalUsage = data.totalUsage;
        } else {
          const data = await GetGatewayUsage(gatewayId, fromDate, toDate);
          stateHistory.totalUsage = data.total_usage;
        }

        this.setState({
          equipmentHistory,
        });
      }
    }
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
      if (this.state.selectedSort === "asc") {
        if (a[this.state.selectedSortBy] < b[this.state.selectedSortBy]) {
          return -1;
        }
        if (a[this.state.selectedSortBy] > b[this.state.selectedSortBy]) {
          return 1;
        }
      } else {
        if (a[this.state.selectedSortBy] > b[this.state.selectedSortBy]) {
          return -1;
        }
        if (a[this.state.selectedSortBy] < b[this.state.selectedSortBy]) {
          return 1;
        }
      }
    });
    this.setState({
      data: result.filter(
        (eq) =>
          eq.Name.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
          eq.Type.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
          eq.Company.toLowerCase().includes(this.state.searchText.toLowerCase())
      ),
      isLoading: false,
    });
  };

  render() {
    return (
      <div class="mb-5">
        <style>
          {`.k-grid-content{
            overflow: hidden !important
            .k-button{
              
            }
          }`}
        </style>
        <FmLoadingScreen isLoading={this.state.isLoading} />
        <div class="row">
          <div class="col-xxl-9 col-xl-8 col-md-12 ">
            <div class="row mx-1 mx-md-0 mx-lg-0 mb-2">
              <div class="col-lg-4 col-xl-4 col-md-6 col-9 px-md-0 px-lg-0">
                <h4>Equipments</h4>
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
              <div class="col-lg-8 col-xl-8 col-md-6 d-none d-sm-none d-md-block d-lg-block d-xl-block d-xxl-block">
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
                            this.loadEquipments();
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
                          editorPlaceholder="Search By Name, Serial, Type or Company"
                          // editorValue={this.state.equipment.Company}
                        >
                          <input
                            className="k-textbox"
                            id="search"
                            name="search"
                            placeholder="Search By Name, Serial, Type or Company"
                            onChange={this.searchEquipment}
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
                          className="w-100"
                        >
                          <i
                            class="icon-document-add1 mr-1"
                            style={{ fontSize: 24 }}
                          ></i>
                          New equipment
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
                          {this.state.sorts.map((sort) => (
                            <option value={sort}>{sort}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                id="equipmentGrid"
                class="d-none d-sm-none d-md-block d-lg-block d-xl-block d-xxl-block"
              >
                {this.state.data.length > 0 ? (
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
                          await this.loadEquipments();
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
                          await this.loadEquipments();
                        }
                      );
                    }}
                    rowRender={this.rowRender}
                  >
                    {columns.map((column, index) => {
                      return (
                        <Column
                          field={column.field}
                          title={column.title}
                          key={index}
                          width={this.setWidth(column.minWidnt)}
                        />
                      );
                    })}
                  </Grid>
                ) : (
                  <div
                    class="w-100 p-3 border"
                    style={{ backgroundColor: "white" }}
                  >
                    <div class="row">
                      <div class="col-12 text-center text-muted">
                        <h1>
                          <i class="icon-youtube_searched_for"></i>
                        </h1>
                        <p>Nothing Found on the Search Criteria</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div class="d-block d-sm-block d-md-none d-lg-none d-xl-none d-xxl-none mt-2">
                {this.state.data.map((eq) => (
                  <div class="card mb-1 shadow-sm">
                    <div class="card-body p-3 pb-1">
                      <div class="card-title">
                        <div class="row">
                          <div class="col-12 my-0 py-0">
                            <label class="m-0 p-0 float-left font-weight-bold small">
                              ID: {eq.EquipmentId}
                            </label>
                          </div>
                          <div class="col-12 my-0 py-0">
                            <label class="m-0 p-0 float-left font-weight-bold">
                              {eq.Name}
                            </label>
                          </div>
                          <div class="col-12 my-0 py-0 text-muted">
                            <label class="m-0 p-0 float-left">
                              {eq.Company}
                            </label>
                            <label class="m-0 p-0 float-right">{eq.Type}</label>
                          </div>
                          {eq.TypeId === 1 || eq.TypeId === 3 ? (
                            <>
                              <div class="col-12 my-0 py-0">
                                <label class="m-0 p-0 float-left">
                                  {eq.Serial}
                                </label>
                                <label class="m-0 p-0 float-right">
                                  {eq.GatewayId}
                                </label>
                              </div>
                            </>
                          ) : null}
                        </div>
                        <div class="row mt-2">
                          <div class="col-12">
                            <button
                              class="k-button k-primary float-right"
                              onClick={async () => {
                                await this.editRow(eq);
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
            id="equipmentDetails"
            class="col-xxl-3 col-xl-4 d-none d-sm-none d-md-none d-lg-none d-xl-block d-xxl-block"
          >
            <EquipmentDetails
              equipment={this.state.equipment}
              location={this.state.location}
              equipmentHistory={this.state.equipmentHistory}
              onEditButtonClick={() => {
                this.setState({
                  showNewEquipmentModal: !this.state.showNewEquipmentModal,
                });
              }}
              onRemoveRestoreEquipment={() => {
                this.removeRestoreEquipment(this.state.equipment);
              }}
              onViewBookingDetails={(history) => {
                this.setState({
                  selectedSalesId: history.SaleId,
                  showDetailsModal: true,
                });
              }}
            />
          </div>
        </div>

        <Modal
          show={this.state.showNewEquipmentModal}
          onHide={this.closeModal}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {this.state.equipment.EquipmentId === 0
                ? "New Equipment"
                : "Edit Equipment"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FmLoadingScreen isLoading={this.state.isModalLoading} />
            <form className="k-form">
              <fieldset>
                {!this.state.error.IsSuccess ? (
                  <Alert variant="danger">{this.state.error.Message}</Alert>
                ) : null}

                <label>Service Type</label>
                <DropDownList
                  disabled={this.state.equipment.EquipmentId !== 0}
                  data={this.state.dropdown}
                  textField="Description"
                  onFilterChange={this.filterChange}
                  value={{
                    Id: this.state.equipment.Type,
                    Description: this.state.equipment.TypeDescription,
                  }}
                  onChange={(e) => {
                    this.setState({
                      equipment: {
                        ...this.state.equipment,
                        TypeId: e.value.Id,
                        Name: "",
                        GatewayId: "",
                        Serial: "",
                        Type: e.value.Id,
                        TypeDescription: e.value.Description,
                      },
                      isGateway: e.value.Id === 3 || e.value.Id === 1,
                    });
                  }}
                />

                {this.state.isGateway ? (
                  <div class="row">
                    <div class="col-8">
                      <label className="k-form-field" style={{ width: "69%" }}>
                        Serial
                      </label>
                      <input
                        className="k-textbox"
                        id="Serial"
                        name="Serial"
                        onChange={this.onChange}
                        value={this.state.equipment.Serial}
                      />
                    </div>
                    <div class="col-4" style={{ marginTop: 31 }}>
                      <button
                        type="button"
                        className="k-button k-primary w-100"
                        onClick={this.searchGateway}
                        style={{
                          height: 40,
                        }}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                ) : null}

                <label className="k-form-field">Name</label>
                <input
                  className="k-textbox"
                  disabled={this.state.isGateway}
                  id="Name"
                  name="Name"
                  onChange={this.onChange}
                  value={this.state.equipment.Name}
                />

                {this.state.isGateway ? (
                  <>
                    <label className="k-form-field">Dejero Id</label>
                    <input
                      className="k-textbox"
                      disabled={true}
                      id="Name"
                      name="Name"
                      onChange={this.onChange}
                      value={this.state.equipment.GatewayId}
                    />
                  </>
                ) : null}

                <label>Company:</label>
                <input
                  className="k-textbox"
                  id="company"
                  name="Company"
                  onChange={this.onChange}
                  value={this.state.equipment.Company}
                />

                <label className="k-form-field">Description</label>
                <textarea
                  className="form-control"
                  placeholder="Description"
                  style={{ resize: "none", height: 100 }}
                  name="Description"
                  onChange={this.onChange}
                  value={this.state.equipment.Description}
                />
              </fieldset>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeModal}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={this.onCreateEquipmentClick}
              disabled={
                this.state.equipment.Name === "" ||
                this.state.equipment.TypeId === 0 ||
                this.state.equipment.Company === "" ||
                ((this.state.equipment.TypeId === 3 ||
                  this.state.equipment.TypeId === 1) &&
                  this.state.equipment.Serial === "") ||
                ((this.state.equipment.TypeId === 3 ||
                  this.state.equipment.TypeId === 1) &&
                  this.state.equipment.GatewayId === "")
              }
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <EquipmentDetailModal
          equipment={this.state.equipment}
          location={this.state.location}
          equipmentHistory={this.state.equipmentHistory}
          onEditButtonClick={() => {
            this.setState({
              showNewEquipmentModal: !this.state.showNewEquipmentModal,
            });
          }}
          onRemoveRestoreEquipment={() => {
            this.removeRestoreEquipment(this.state.equipment);
          }}
          onViewBookingDetails={(history) => {
            this.setState({
              selectedSalesId: history.SaleId,
              showDetailsModal: true,
            });
          }}
          show={this.state.showEquipmentDetailsModal}
          onHide={() => {
            this.setState({ showEquipmentDetailsModal: false });
          }}
        />

        {this.state.selectedSalesId && this.state.showDetailsModal ? (
          <BookingDetailsModal
            selectedEquipmentId={this.state.equipment.EquipmentId}
            salesId={this.state.selectedSalesId}
            show={this.state.showDetailsModal}
            displayEditButton={false}
            onHide={() => {
              this.setState({ showDetailsModal: !this.state.showDetailsModal });
            }}
          />
        ) : null}
      </div>
    );
  }
}
function mapStateToProps(state) {}

function mapDispatchToProps() {}

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentPage);
