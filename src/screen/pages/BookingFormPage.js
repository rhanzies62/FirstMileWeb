import { DatePicker, DateRangePicker } from "@progress/kendo-react-dateinputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import React, { Component } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { connect } from "react-redux";
import FmLoadingScreen from "../components/FmLoadingScreen";
import {
  ListAvailableEquipment,
  listCustomers,
  ListStatusTypes,
  ListActivityType,
} from "../../apiService/lookUpAPI";
import {
  checkIfEquipmentAvailable,
  createBooking,
  listBookingsEquipment,
} from "../../apiService/bookingAPI";
import { FloatingLabel } from "@progress/kendo-react-labels";
import moment from "moment";
import { filter } from "@progress/kendo-data-query/dist/npm/transducers";

class BookingFormPage extends Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.emptyBookEquipment = {
      index: 0,
      SaleEquipmentId: 0,
      EquipmentId: 0,
      BorrowedDateFrom: "",
      BorrowedDateTo: "",
      ServiceTypeId: 0,
      SelectedActivityType: {
        Id: 0,
        Description: "",
      },
      SelectedEquipment: {
        Id: 0,
        Description: "",
      },
      isAvailable: true,
    };
    this.state = {
      isLoading: false,
      booking: { BookEquipments: [{ ...this.emptyBookEquipment }] },
      customers: [],
      equipments: [],
      originalEquipments: [],
      allEquipments: [],
      status: [],
      activityTypes: [],
      validationError: {
        hasError: false,
        message: "",
      },
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const customers = await listCustomers();
    const availableEquipment = await ListAvailableEquipment();
    const activityTypes = await ListActivityType();
    let filteredEquipment = [...availableEquipment];
    const status = await ListStatusTypes();
    let _booking = {
      CustomerId: 0,
      SalesId: 0,
      BookEquipments: [{ ...this.emptyBookEquipment }],
      selectedCustomer: { Id: 0, Description: "" },
      selectedStatus: { Id: 0, Description: "" },
    };
    if (this.props.booking.SalesId) {
      const { booking } = this.props;
      const _selectedCustomer = customers.filter(
        (i) => i.Id === booking.CustomerId
      );
      const _selectedStatus = status.filter((i) => i.Id === booking.StatusId);
      _booking = {
        CustomerId: booking.CustomerId,
        selectedCustomer: _selectedCustomer[0],
        selectedStatus: _selectedStatus[0],
        SalesId: booking.SalesId,
        StatusId: booking.StatusId,
        ProjectName: booking.ProjectName,
        BookEquipments: [],
        Comment: booking.Comment,
        Discount: booking.Discount,
        ShippingInfo: booking.ShippingInfo,
        DropOffDate: booking.DropOffDate ? new Date(booking.DropOffDate) : null,
      };

      const bookedEquipment = await listBookingsEquipment(
        {
          Skip: 0,
          Take: 10,
        },
        this.props.booking.SalesId
      );
      bookedEquipment.Data.map((eq, index) => {
        let bookeq = {
          index: index,
          SaleEquipmentId: eq.SaleEquipmentId,
          EquipmentId: eq.EquipmentId,
          BorrowedDateFrom: new Date(eq.BorrowedDateFromST),
          BorrowedDateTo: new Date(eq.BorrowedDateToST),
          StartDate: eq.BorrowedDateFromST,
          EndDate: eq.BorrowedDateToST,
          SelectedEquipment: {
            Id: 0,
            Description: "",
          },
          ServiceTypeId: eq.ServiceTypeId,
          SelectedActivityType: {
            Id: 0,
            Description: "",
          },
          isAvailable: true,
        };
        let _selectedEquipment = availableEquipment.filter(
          (i) => i.Id === eq.EquipmentId
        );
        let _selectedActivity = activityTypes.filter(
          (i) => i.Id === eq.ServiceTypeId
        );
        bookeq.SelectedEquipment = _selectedEquipment[0];
        bookeq.SelectedActivityType = _selectedActivity[0];
        _booking.BookEquipments.push(bookeq);
      });

      filteredEquipment = [];
      availableEquipment.map((ae) => {
        if (
          bookedEquipment.Data.filter((i) => i.EquipmentId === ae.Id).length <=
          0
        ) {
          filteredEquipment.push(ae);
        }
      });
    }

    this.setState({
      customers,
      equipments: filteredEquipment,
      allEquipments: availableEquipment,
      originalEquipments: availableEquipment,
      activityTypes,
      status,
      booking: _booking,
      isLoading: false,
    });
  }

  checkIfEquipmentAvailable = async (be) => {
    if (
      be.BorrowedDateFrom !== "" &&
      be.BorrowedDateTo !== "" &&
      be.EquipmentId !== 0
    ) {
      const equipmentBooking = { ...be };
      equipmentBooking.BorrowedDateFrom = moment(
        equipmentBooking.BorrowedDateFrom
      ).format("MM/DD/YYYY");
      equipmentBooking.BorrowedDateTo = moment(
        equipmentBooking.BorrowedDateTo
      ).format("MM/DD/YYYY");
      var result = await checkIfEquipmentAvailable(equipmentBooking);
      return result.Data;
    }
    return false;
  };

  onActivityTypeChange = (e, be) => {
    let bookEquipment = [...this.state.booking.BookEquipments];
    let obj = bookEquipment.find((i) => i.index === be.index);
    if (obj) {
      obj.ServiceTypeId = e.value.Id;
      obj.SelectedActivityType = e.value;
      this.setState({
        booking: {
          ...this.state.booking,
          BookEquipments: bookEquipment,
        },
      });
    }
  };

  onEquipmentTypeChange = async (e, be) => {
    let bookEquipment = [...this.state.booking.BookEquipments];
    let obj = bookEquipment.find((i) => i.index === be.index);
    if (obj) {
      obj.EquipmentId = e.value.Id;
      obj.SelectedEquipment = e.value;
      if (obj.SelectedEquipment.Type !== 5) {
        const isAvailable = await this.checkIfEquipmentAvailable(obj);
        obj.isAvailable = !isAvailable;
      }

      let filtered = this.state.allEquipments.filter((i) => {
        return i.Id !== e.value.Id;
      });

      bookEquipment.map((beIndex) => {
        if (beIndex.EquipmentId !== 0) {
          filtered = filtered.filter((i) => {
            return i.Id !== beIndex.SelectedEquipment.Id;
          });
        }
      });

      this.setState({
        booking: {
          ...this.state.booking,
          BookEquipments: bookEquipment,
        },
        equipments: [...filtered],
        originalEquipments: [...filtered],
      });
    }
  };

  renderRentalEquipment = (be) => {
    return (
      <div class="col-md-12 col-lg-6 mt-3 px-0">
        <Card>
          <Card.Body>
            <div class="row">
              <div class="col-12">
                <button
                  type="button"
                  class="close float-right"
                  aria-label="Close"
                  onClick={async () => {
                    if (be.SaleEquipmentId === 0) {
                      var equipments = [...this.state.booking.BookEquipments];
                      this.setState({
                        booking: {
                          ...this.state.booking,
                          BookEquipments: equipments.filter((e) => e != be),
                        },
                      });
                    } else {
                      await this.props.onRemoveEquipmentCallBack(
                        be.SaleEquipmentId
                      );
                      this.props.handleClose();
                    }
                  }}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="col-12">
                <label>Activity Type</label>
                <DropDownList
                  style={{ width: "100%" }}
                  data={this.state.activityTypes}
                  value={be.SelectedActivityType}
                  textField="Description"
                  onChange={async (e) => {
                    this.onActivityTypeChange(e, be);
                  }}
                  onFilterChange={(e) => {
                    console.log(e.filter.value);
                  }}
                />
              </div>
              {be.ServiceTypeId === 1 ? (
                <div class="col-12 mt-2">
                  <label>Equipment</label>
                  <DropDownList
                    popupSettings={{
                      appendTo: document.getElementById("bookingModal"),
                    }}
                    style={{ width: "100%" }}
                    data={this.state.equipments}
                    value={be.SelectedEquipment}
                    textField="Description"
                    filterable={true}
                    onFilterChange={this.filterChange}
                    onChange={async (e) => {
                      await this.onEquipmentTypeChange(e, be);
                    }}
                    onFilterChange={(e) => {
                      let originalList = [...this.state.originalEquipments];
                      let equipments = originalList.filter((i) =>
                        i.Description.toLocaleUpperCase().includes(
                          e.filter.value.toLocaleUpperCase()
                        )
                      );
                      this.setState({ equipments });
                    }}
                  />
                  {!be.isAvailable ? (
                    <small className="text-danger">
                      This equipment is not available in the specified duration
                    </small>
                  ) : null}
                </div>
              ) : null}

              <div class="col-12 col-md-6 mt-2">
                <label>From:</label>
                <DatePicker
                  popupSettings={{
                    appendTo: document.getElementById("bookingModal"),
                  }}
                  className="full-width"
                  value={be.BorrowedDateFrom}
                  max={
                    be.BorrowedDateTo === ""
                      ? new Date("1/1/2200")
                      : be.BorrowedDateTo
                  }
                  onChange={async (e) => {
                    let bookEquipment = [...this.state.booking.BookEquipments];
                    let obj = bookEquipment.find((i) => i.index === be.index);
                    if (obj) {
                      obj.BorrowedDateFrom = e.value;
                      obj.StartDate = `${e.value.toDateString()} 00:00:00`;

                      if (obj.SelectedEquipment.Type !== 5) {
                        const isAvailable = await this.checkIfEquipmentAvailable(
                          obj
                        );
                        obj.isAvailable = !isAvailable;
                      }

                      this.setState({
                        booking: {
                          ...this.state.booking,
                          BookEquipments: bookEquipment,
                        },
                      });
                    }
                  }}
                />
              </div>
              <div class="col-12 col-md-6 mt-2">
                <label>To:</label>
                <DatePicker
                  popupSettings={{
                    appendTo: document.getElementById("bookingModal"),
                  }}
                  className="full-width"
                  value={be.BorrowedDateTo}
                  min={
                    be.BorrowedDateFrom === ""
                      ? new Date()
                      : be.BorrowedDateFrom
                  }
                  onChange={async (e) => {
                    console.log(this.modal);
                    let bookEquipment = [...this.state.booking.BookEquipments];
                    let obj = bookEquipment.find((i) => i.index === be.index);
                    if (obj) {
                      obj.BorrowedDateTo = e.value;
                      obj.EndDate = `${e.value.toDateString()} 23:59:59`;

                      if (obj.SelectedEquipment.Type !== 5) {
                        const isAvailable = await this.checkIfEquipmentAvailable(
                          obj
                        );
                        obj.isAvailable = !isAvailable;
                      }

                      this.setState({
                        booking: {
                          ...this.state.booking,
                          BookEquipments: bookEquipment,
                        },
                      });
                    }
                  }}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  };

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.handleClose}
        data-focus="false"
        ref={this.modal}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {this.state.booking.SalesId === 0
              ? "Create Booking"
              : "Edit Booking"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body id="bookingModal">
          <FmLoadingScreen isLoading={this.state.isLoading} />

          <Container fluid>
            {this.state.validationError.hasError ? (
              <div class="row">
                <div class="col-12">
                  <div class="alert alert-danger">
                    {this.state.validationError.message}
                  </div>
                </div>
              </div>
            ) : null}

            <form className="k-form">
              <Row>
                <div class="col-6">
                  <fieldset>
                    <label className="k-form-field">
                      <DropDownList
                        value={this.state.booking.selectedStatus}
                        data={this.state.status}
                        label="Select Status"
                        textField="Description"
                        filterable={true}
                        onFilterChange={this.filterChange}
                        onChange={(e) => {
                          this.setState({
                            booking: {
                              ...this.state.booking,
                              StatusId: e.value.Id,
                              selectedStatus: e.value,
                            },
                          });
                        }}
                      />
                    </label>
                  </fieldset>
                </div>
                <div class="col-6">
                  <fieldset>
                    <label className="k-form-field">
                      <DropDownList
                        data={this.state.customers}
                        value={this.state.booking.selectedCustomer}
                        label="Select Customer"
                        textField="Description"
                        filterable={true}
                        onFilterChange={this.filterChange}
                        onChange={(e) => {
                          this.setState({
                            booking: {
                              ...this.state.booking,
                              CustomerId: e.value.Id,
                              selectedCustomer: e.value,
                            },
                          });
                        }}
                      />
                    </label>
                  </fieldset>
                </div>
                <div class="col-6">
                  <fieldset>
                    <label class="form-label">Project Name</label>
                    <input
                      className="k-textbox"
                      id="ProjectName"
                      name="ProjectName"
                      onChange={(e) => {
                        this.setState({
                          booking: {
                            ...this.state.booking,
                            ProjectName: e.target.value,
                          },
                        });
                      }}
                      value={this.state.booking.ProjectName}
                    />
                  </fieldset>
                </div>
                <div class="col-6">
                  <fieldset>
                    <label class="form-label">Shipping Info</label>
                    <input
                      className="k-textbox"
                      id="ShippingInfo"
                      name="ShippingInfo"
                      onChange={(e) => {
                        this.setState({
                          booking: {
                            ...this.state.booking,
                            ShippingInfo: e.target.value,
                          },
                        });
                      }}
                      value={this.state.booking.ShippingInfo}
                    />
                  </fieldset>
                </div>
                <div class="col-6">
                  <fieldset>
                    <label class="form-label">Discount</label>
                    <input
                      className="k-textbox"
                      id="Discount"
                      name="Discount"
                      onChange={(e) => {
                        this.setState({
                          booking: {
                            ...this.state.booking,
                            Discount: e.target.value,
                          },
                        });
                      }}
                      value={this.state.booking.Discount}
                    />
                  </fieldset>
                </div>
                <div class="col-6">
                  <label>Drop Off Date:</label>
                  <DatePicker
                    popupSettings={{
                      appendTo: document.getElementById("bookingModal"),
                    }}
                    className="full-width"
                    value={this.state.booking.DropOffDate}
                    onChange={(e) => {
                      this.setState({
                        booking: {
                          ...this.state.booking,
                          DropOffDate: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
                <div class="col-12">
                  <label>Comments/Notes:</label>
                  <textarea
                    class="form-control"
                    value={this.state.booking.Comment}
                    onChange={(e) => {
                      this.setState({
                        booking: {
                          ...this.state.booking,
                          Comment: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
              </Row>
            </form>

            <div
              style={{ maxHeight: 500 }}
              class="overflow-auto mt-3 container-fluid"
            >
              <div class="row">
                {this.state.booking.BookEquipments.map((be) => {
                  return this.renderRentalEquipment(be);
                })}
              </div>
            </div>

            <Row className="mt-3">
              <Col>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    onClick={() => {
                      let bookEquipments = [
                        ...this.state.booking.BookEquipments,
                      ];
                      let emptyBookingEquipment = {
                        ...this.emptyBookEquipment,
                      };
                      emptyBookingEquipment.index = bookEquipments.length;
                      bookEquipments.push(emptyBookingEquipment);
                      this.setState({
                        booking: {
                          ...this.state.booking,
                          BookEquipments: bookEquipments,
                        },
                      });
                    }}
                  >
                    Add Equipment
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          {this.props.booking.SalesId ? (
            <button
              class="btn btn-danger"
              onClick={async () => {
                await this.props.onRemoveCallBack();
                this.props.handleClose();
              }}
            >
              Delete
            </button>
          ) : null}

          <Button variant="secondary" onClick={this.props.handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              let bookEquipmentIsValid = true;
              this.state.booking.BookEquipments.map((i) => {
                if (
                  i.ServiceTypeId === 0 ||
                  !i.isAvailable ||
                  i.BorrowedDateFrom === "" ||
                  i.BorrowedDateTo === ""
                )
                  bookEquipmentIsValid = false;
              });
              this.setState({
                validationError: {
                  hasError: false,
                  message: "Please select a customer",
                },
              });
              if (this.state.booking.CustomerId === 0) {
                this.setState({
                  validationError: {
                    hasError: true,
                    message: "Please select a customer",
                  },
                });
              } else if (!this.state.booking.StatusId) {
                this.setState({
                  validationError: {
                    hasError: true,
                    message: "Please select a status",
                  },
                });
              } else if (!this.state.booking.ProjectName) {
                this.setState({
                  validationError: {
                    hasError: true,
                    message: "Please provide the project name",
                  },
                });
              } else if (!bookEquipmentIsValid) {
                this.setState({
                  validationError: {
                    hasError: true,
                    message:
                      "Some of your equipment has an incomplete information. Please check again.",
                  },
                });
              } else {
                if (
                  this.state.booking.CustomerId !== 0 &&
                  this.state.booking.StatusId &&
                  this.state.booking.ProjectName &&
                  bookEquipmentIsValid
                ) {
                  this.setState({ isLoading: true });
                  const result = await createBooking(this.state.booking);
                  if (result.IsSuccess) {
                    this.props.handleClose();
                    await this.props.handleSuccess();
                  }
                }
              }
            }}
          >
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BookingFormPage);
