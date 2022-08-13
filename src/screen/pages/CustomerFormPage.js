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
  createCustomer,
  ListAllAvailableUser,
  ListAssignedUserByCustomerId,
} from "../../apiService/customerAPI";
import { Alert, Card, Modal } from "react-bootstrap";
import { MaskedTextBox } from "@progress/kendo-react-inputs";
import { generatePassword } from "../../utility";

class CustomerFormPage extends Component {
  constructor(props) {
    super(props);
    this.emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.state = {
      isLoading: false,
      customer: {
        CustomerId: 0,
        Name: "",
        Phone: "",
        Email: "",
        Address: "",
        CountryId: null,
        ProvinceId: null,
        City: "",
        PostalCode: "",
        CustomerUsers: [],
        selectedCountry: { Id: 0, Description: "" },
        selectedProvince: { Id: 0, Description: "" },
      },
      availableUsers: [],
      error: {
        IsSuccess: true,
        Message: "",
        windowHeight: 800,
        Data: [],
      },
      countries: [],
      provinces: [],
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    await this.listAllAvailableUser();
    const countries = await ListCountry();
    const { selectedCustomer } = this.props;
    if (selectedCustomer.CustomerId) {
      const selectedCountry = countries.filter(
        (i) => i.Id === selectedCustomer.CountryId
      );

      const provinces = await this.loadProvince(selectedCustomer.CountryId);
      const selectedProvince = provinces.filter(
        (i) => i.Id === selectedCustomer.ProvinceId
      );

      const customerUsers = await ListAssignedUserByCustomerId(
        selectedCustomer.CustomerId
      );
      let CustomerUsers = [];
      customerUsers.map((i) => {
        CustomerUsers.push({
          FmUser: {
            ...i,
            Password: i.PasswordRaw,
          },
          CustomerUserId: i.CustomerUserId,
        });
      });

      let customer = {
        CustomerId: selectedCustomer.CustomerId,
        Name: selectedCustomer.Name,
        Phone: selectedCustomer.Phone,
        Email: selectedCustomer.Email,
        Address: selectedCustomer.Address,
        CountryId: selectedCustomer.CountryId,
        ProvinceId: selectedCustomer.ProvinceId,
        City: selectedCustomer.City,
        PostalCode: selectedCustomer.PostalCode,
        CustomerUsers,
        selectedCountry: selectedCountry[0],
        selectedProvince: selectedProvince[0],
      };
      this.setState({ customer, isLoading: false, countries: countries });
    }
    this.setState({ isLoading: false, countries });
  }

  onChange = (e) => {
    this.setState({
      customer: {
        ...this.state.customer,
        [e.target.name]: e.target.value,
      },
    });
  };

  loadProvince = async (countryId) => {
    const provinces = await ListProvince(countryId);
    this.setState({ provinces: provinces });
    return provinces;
  };

  onSubmitPress = async () => {
    this.setState({
      isLoading: true,
    });
    const result = await createCustomer(this.state.customer);
    if (result.IsSuccess) {
      await this.props.onSubmitSuccess();
      this.props.onClose();
    } else {
      this.setState({
        isLoading: false,
        error: {
          IsSuccess: result.IsSuccess,
          Message: result.Message,
          windowHeight: 510,
          Data: result.Data,
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

  render() {
    return (
      <Modal size="lg" show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {this.state.customer.CustomerId === 0
              ? "New Customer"
              : "Edit Customer"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FmLoadingScreen isLoading={this.state.isLoading} />
          {!this.emailReg.test(this.state.customer.Email) &&
          this.state.customer.Email !== "" ? (
            <Alert variant="danger">
              Email address is not in correct format
            </Alert>
          ) : null}

          <form className="k-form">
            {!this.state.error.IsSuccess ? (
              <Alert variant="danger">
                <p>{this.state.error.Message}</p>
                {this.state.error.Data ? (
                  <ul>
                    {this.state.error.Data.map((i) => (
                      <li>{i}</li>
                    ))}
                  </ul>
                ) : null}
              </Alert>
            ) : null}

            <fieldset>
              <div className="row">
                <div className="col-md-6">
                  <label class="form-label" class="pb-0 mb-0">
                    *Name:
                  </label>
                  <input
                    className="form-control pt-0 mt-0"
                    id="Name"
                    type="text"
                    name="Name"
                    onChange={this.onChange}
                    value={this.state.customer.Name}
                  />

                  <label class="form-label" class="pb-0 mb-0">
                    *Address:
                  </label>
                  <input
                    className="form-control pt-0 mt-0"
                    id="Address"
                    type="text"
                    name="Address"
                    onChange={this.onChange}
                    value={this.state.customer.Address}
                  />

                  <label class="form-label" class="pb-0 mb-0">
                    *Email:
                  </label>
                  <input
                    className="form-control pt-0 mt-0"
                    id="Email"
                    type="text"
                    name="Email"
                    onChange={this.onChange}
                    value={this.state.customer.Email}
                  />

                  <label class="form-label" class="pb-0 mb-0">
                    *Phone:
                  </label>
                  <MaskedTextBox
                    mask="(999) 999-9999"
                    id="phone"
                    name="Phone"
                    onChange={this.onChange}
                    value={this.state.customer.Phone}
                  />
                </div>
                <div className="col-md-6">
                  <label class="form-label" class="pb-0 mb-0">
                    *Country:
                  </label>
                  <DropDownList
                    data={this.state.countries}
                    textField="Description"
                    filterable={true}
                    value={this.state.customer.selectedCountry}
                    onFilterChange={this.filterChange}
                    onChange={async (e) => {
                      await this.loadProvince(e.value.Id);
                      this.setState({
                        customer: {
                          ...this.state.customer,
                          CountryId: e.value.Id,
                          selectedCountry: e.value,
                          selectedProvince: { Id: 0, Description: "" },
                        },
                      });
                    }}
                  />

                  <label class="form-label" class="pb-0 mb-0">
                    *Province:
                  </label>
                  <DropDownList
                    data={this.state.provinces}
                    textField="Description"
                    filterable={true}
                    onFilterChange={this.filterChange}
                    value={this.state.customer.selectedProvince}
                    onChange={(e) => {
                      this.setState({
                        customer: {
                          ...this.state.customer,
                          ProvinceId: e.value.Id,
                          selectedProvince: e.value,
                        },
                      });
                    }}
                  />

                  <label class="form-label" class="pb-0 mb-0">
                    *City:
                  </label>
                  <input
                    className="k-textbox"
                    id="City"
                    name="City"
                    onChange={this.onChange}
                    value={this.state.customer.City}
                  />

                  <label class="form-label" class="pb-0 mb-0">
                    *PostalCode:
                  </label>
                  <input
                    className="k-textbox"
                    id="PostalCode"
                    name="PostalCode"
                    onChange={this.onChange}
                    value={this.state.customer.PostalCode}
                  />
                </div>
              </div>
            </fieldset>

            <div className="row " style={{ marginTop: 20 }}>
              <div className="col-md-12 d-none d-lg-block">
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
                            disabled={i.CustomerUserId}
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

              <div
                style={{ maxHeight: 500 }}
                class="overflow-auto mt-3 container-fluid"
              >
                <div className="col-md-12 d-md-block d-lg-none">
                  {this.state.customer.CustomerUsers.map((i) => (
                    <div class="col-md-12 col-lg-6 mt-3">
                      <Card>
                        <Card.Body>
                          <div class="row">
                            <div class="col-6">
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
                            </div>
                            <div class="col-6">
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
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-6">
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
                            </div>
                            <div class="col-6">
                              <input
                                className="k-textbox"
                                placeholder="Password"
                                readOnly={true}
                                id="PostalCode"
                                name="PostalCode"
                                value={i.FmUser.Password}
                              />
                            </div>
                          </div>
                          <div class="row mt-2 float-right">
                            <div class="col-6">
                              <button
                                type="button"
                                disabled={i.CustomerUserId}
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
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-12 mt-4">
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
                          Password: generatePassword(),
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
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={this.onSubmitPress}
            disabled={this.state.customer.Name === ""}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      // <Window
      //   ref={(window) => (this.window = window)}
      //   title={"New Customer"}
      //   onClose={this.props.onClose}
      //   height={this.state.error.windowHeight}
      //   width={800}
      //   initialTop={20}
      //   maximizeButton={false}
      //   minimizeButton={false}
      //   resizable={false}
      // ></Window>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerFormPage);
