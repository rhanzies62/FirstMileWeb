import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { filterBy, process } from "@progress/kendo-data-query";
import { Button } from "@progress/kendo-react-buttons";
import { ColumnMenu, ColumnMenuCheckboxFilter } from "../components/ColumnMenu";
import { Window } from "@progress/kendo-react-dialogs";
import { FloatingLabel } from "@progress/kendo-react-labels";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import {
  ListProvince,
  ListCountry,
  listEquipmentTypes,
} from "../../apiService/lookUpAPI";
import FmLoadingScreen from "../components/FmLoadingScreen";
import {
  addCustomerUser,
  ListAllAvailableUser,
} from "../../apiService/customerAPI";
import { Alert } from "react-bootstrap";

class CustomerUserFormPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customer: {
        CustomerId: 0,
        CustomerUsers: [
          {
            FmUser: {
              FirstName: "",
              LastName: "",
              Username: "",
              Password: this.generatePassword(),
            },
          },
        ],
      },
      availableUsers: [],
      error: {
        IsSuccess: true,
        Message: "",
        windowHeight: 400,
      },
      countries: [],
      provinces: [],
    };
  }

  componentDidMount() {
    this.listAllAvailableUser().then();
    this.loadCountries().then();
  }

  onChange = (e) => {
    this.setState({
      customer: {
        ...this.state.customer,
        [e.target.name]: e.target.value,
      },
    });
  };

  loadCountries = async () => {
    const countries = await ListCountry();
    this.setState({ countries: countries });
  };

  loadProvince = async (countryId) => {
    const provinces = await ListProvince(countryId);
    this.setState({ provinces: provinces });
  };

  onSubmitPress = async () => {
    let model = { ...this.state.customer, CustomerId: this.props.customerId };
    const result = await addCustomerUser(model);
    if (result.IsSuccess) {
      await this.props.onSubmitSuccess();
      this.props.onClose();
    } else {
      this.setState({
        error: {
          IsSuccess: result.IsSuccess,
          Message: result.Message,
          windowHeight: 510,
        },
      });
    }
  };

  listAllAvailableUser = async () => {
    const result = await ListAllAvailableUser();
    this.setState({ availableUsers: result });
  };

  onChangeList = (e, i) => {
    let customer = { ...this.state.customer };
    let customerUser = customer.CustomerUsers.filter((cu) => cu === i);
    customerUser[0].FmUser[e.target.name] = e.target.value;
    this.setState({ customer });
  };

  generatePassword = () => {
    var length = 8,
      charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  };

  render() {
    return (
      <Window
        ref={(window) => (this.window = window)}
        title={"Add New User"}
        onClose={this.props.onClose}
        height={this.state.error.windowHeight}
        width={800}
        initialTop={20}
        maximizeButton={false}
        minimizeButton={false}
        resizable={false}
      >
        <form className="k-form">
          {!this.state.error.IsSuccess ? (
            <Alert variant="danger">{this.state.error.Message}</Alert>
          ) : null}

          <div className="row" style={{ marginTop: 20 }}>
            <div className="col-md-12">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.customer.CustomerUsers.map((i) => (
                    <tr>
                      <td>
                        <input
                          className="k-textbox"
                          placeholder="First Name"
                          id="FirstName"
                          name="FirstName"
                          onChange={(e) => {
                            this.onChangeList(e, i);
                          }}
                          value={i.FmUser.FirstName}
                        />
                      </td>
                      <td>
                        <input
                          className="k-textbox"
                          placeholder="Last Name"
                          id="LastName"
                          name="LastName"
                          onChange={(e) => {
                            this.onChangeList(e, i);
                          }}
                          value={i.FmUser.LastName}
                        />
                      </td>
                      <td>
                        <input
                          className="k-textbox"
                          placeholder="Username"
                          id="Username"
                          name="Username"
                          onChange={(e) => {
                            this.onChangeList(e, i);
                          }}
                          value={i.FmUser.Username}
                        />
                      </td>
                      <td>
                        <input
                          className="k-textbox"
                          placeholder="Password"
                          readOnly={true}
                          id="PostalCode"
                          name="PostalCode"
                          value={i.FmUser.Password}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="k-button k-danger"
                          onClick={() => {
                            let customer = { ...this.state.customer };
                            let customerUsers = customer.CustomerUsers.filter(
                              (cu) => cu !== i
                            );
                            customer.CustomerUsers = [...customerUsers];
                            this.setState({
                              customer,
                            });
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-md-12">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "end",
                }}
              >
                <button
                  type="button"
                  className="k-button k-primary"
                  onClick={() => {
                    let customer = { ...this.state.customer };
                    customer.CustomerUsers.push({
                      FmUser: {
                        FirstName: "",
                        LastName: "",
                        Username: "",
                        Password: this.generatePassword(),
                      },
                    });
                    this.setState({
                      customer,
                    });
                  }}
                >
                  Add User
                </button>
              </div>
            </div>
          </div>

          <div className="text-right" style={{ marginTop: 30 }}>
            <button
              type="button"
              className="k-button"
              onClick={this.props.onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="k-button k-primary"
              onClick={this.onSubmitPress}
              disabled={
                this.state.customer.Name === "" ||
                this.state.customer.Phone === "" ||
                this.state.customer.Email === ""
              }
            >
              Submit
            </button>
          </div>
        </form>
      </Window>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerUserFormPage);
