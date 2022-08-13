import React, { Component } from "react";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  MonthView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import FmLoadingScreen from "../components/FmLoadingScreen";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import {
  ListBookingsSchedules,
  ListBookingSchedulesByProjectId,
} from "../../apiService/bookingAPI";
import {
  ListProjectsByCustomerId,
  listCustomers,
} from "../../apiService/lookUpAPI";
import BookingDetailsModal from "./BookingDetailsModal";

class SchedulerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: new Date(),
      scheduleData: [],
      selectedCustomer: {
        Id: "",
        Description: "--All Customers--",
      },
      customers: [],
      projects: [],
      selectedSalesId: null,
      showDetailsModal: false,
      isLoading: false,
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    await this.loadCustomers();
    const scheduleData = await ListBookingsSchedules();
    this.setState({ scheduleData, isLoading: false });
  }

  loadCustomers = async () => {
    this.setState({ isLoading: true });
    const result = await listCustomers();
    const data = [
      {
        Id: "0",
        Description: "--All Customers--",
      },
      ...result,
    ];
    this.setState({ customers: data, isLoading: false });
  };

  currentDateChange = (currentDate) => {
    this.setState({ currentDate });
  };

  Appointment = (props) => {
    const { children, style, ...restProps } = props;
    return (
      <Appointments.Appointment
        {...restProps}
        style={{
          ...style,
          backgroundColor: restProps.data.color,
          borderRadius: "8px",
        }}
        onClick={() => {
          this.setState({
            selectedSalesId: restProps.data.SalesId,
            showDetailsModal: true,
          });
        }}
      >
        {children}
      </Appointments.Appointment>
    );
  };

  onCustomerChange = async (e) => {
    this.setState({
      selectedCustomer: e.value,
    });
    let scheduleData = [];
    let projects = [];
    if (e.value.Id !== "0") {
      this.setState({ isLoading: true });
      const result = await ListProjectsByCustomerId(e.value.Id);
      projects = [
        {
          Id: "0",
          Description: "--All Projects--",
        },
        ...result,
      ];
      scheduleData = await ListBookingsSchedules(e.value.Id);
    } else {
      this.setState({ isLoading: true });
      scheduleData = await ListBookingsSchedules();
    }
    this.setState({ projects, scheduleData, isLoading: false });
  };

  onProjectChange = async (e) => {
    let scheduleData = [];
    this.setState({ isLoading: true });
    if (e.value.Id !== "0") {
      scheduleData = await ListBookingSchedulesByProjectId(
        this.state.selectedCustomer.Id,
        e.value.Id
      );
    } else {
      scheduleData = await ListBookingsSchedules(
        this.state.selectedCustomer.Id
      );
    }
    this.setState({ scheduleData, isLoading: false });
  };

  render() {
    return (
      <>
        <FmLoadingScreen isLoading={this.state.isLoading} />
        <div class="row">
          <div class="col-12">
            <div class="card shadow-sm">
              <div class="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-3 mr-1">
                        <DropDownList
                          label="Customer"
                          value={this.state.selectedCustomer}
                          data={this.state.customers}
                          textField="Description"
                          style={{ width: "100%" }}
                          onChange={this.onCustomerChange}
                        />
                      </div>
                      {this.state.projects.length > 0 ? (
                        <div className="col-md-3">
                          <DropDownList
                            label="Projects"
                            data={this.state.projects}
                            textField="Description"
                            style={{ width: "100%" }}
                            onChange={this.onProjectChange}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-md-12 mt-3">
                    <Paper>
                      <Scheduler data={this.state.scheduleData}>
                        <ViewState
                          currentDate={this.state.currentDate}
                          onCurrentDateChange={this.currentDateChange}
                        />
                        <MonthView />
                        <Toolbar />
                        <DateNavigator />
                        <TodayButton />
                        <Appointments appointmentComponent={this.Appointment} />
                      </Scheduler>
                    </Paper>
                  </div>
                </div>
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

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = () => {};

export default connect(mapStateToProps, mapDispatchToProps)(SchedulerPage);
