import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { filterBy, process } from "@progress/kendo-data-query";
import { Button } from "@progress/kendo-react-buttons";
import { ColumnMenu, ColumnMenuCheckboxFilter } from "../components/ColumnMenu";
import { Window } from "@progress/kendo-react-dialogs";
import { FloatingLabel } from "@progress/kendo-react-labels";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { ListProvince, ListCountry } from "../../apiService/lookUpAPI";
import { createUser } from "../../apiService/userAPI";
import FmLoadingScreen from "../components/FmLoadingScreen";
import { Alert, Col } from "react-bootstrap";
import { MaskedTextBox } from "@progress/kendo-react-inputs";
import { Container, Modal, Row, Table } from "react-bootstrap";

class UserFormModal extends Component {
  constructor(props) {
    super(props);
    this.passwordReg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    this.emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.state = {
      model: {
        FirstName: "",
        LastName: "",
        Username: "",
        Password: "",
        ConfirmPassword: "",
        CountryId: 0,
        ProvinceId: 0,
        City: "",
        PostalCode: "",
        Email: "",
        ContactNumber: "",
        UserTypeId: 1,
      },
      error: {
        IsSuccess: true,
        Message: "",
        windowHeight: 720,
      },
      countries: [],
      provinces: [],
      userType: [
        {
          Id: 1,
          Description: "Admin",
        },
        {
          Id: 2,
          Description: "User",
        },
      ],
    };
  }

  componentDidMount() {
    this.loadCountries().then();
  }

  loadCountries = async () => {
    const countries = await ListCountry();
    this.setState({ countries: countries });
  };

  loadProvince = async (countryId) => {
    const provinces = await ListProvince(countryId);
    this.setState({ provinces: provinces });
  };

  onChange = (e) => {
    this.setState({
      model: {
        ...this.state.model,
        [e.target.name]: e.target.value,
      },
    });
  };

  onSubmitPress = async () => {
    const result = await createUser(this.state.model);
    if (result.IsSuccess) {
      await this.props.onSubmitSuccess();
      this.props.onClose();
    } else {
      this.setState({
        error: {
          IsSuccess: result.IsSuccess,
          Message: result.Message,
          windowHeight: 800,
        },
      });
    }
  };
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="k-form">
            {!this.state.error.IsSuccess ? (
              <Alert variant="danger">{this.state.error.Message}</Alert>
            ) : null}

            {!this.emailReg.test(this.state.model.Email) &&
            this.state.model.Email !== "" ? (
              <Alert variant="danger">
                Email address is not in correct format
              </Alert>
            ) : null}

            {!this.passwordReg.test(this.state.model.Password) &&
            this.state.model.Password !== "" ? (
              <Alert variant="danger">
                Password should have a minimum of eight characters, at least one
                uppercase letter, one lowercase letter, one number and one
                special character
              </Alert>
            ) : null}

            {!this.passwordReg.test(this.state.model.ConfirmPassword) &&
            this.state.model.ConfirmPassword !== "" ? (
              <Alert variant="danger">
                Password should have a minimum of eight characters, at least one
                uppercase letter, one lowercase letter, one number and one
                special character
              </Alert>
            ) : null}

            <fieldset>
              <div className="row">
                <div className="col-md-12">
                  <label>Basic Information</label>
                </div>
                <div className="col-md-6">
                  <label class="form-label">*First Name</label>
                  <input
                    className="k-textbox form-control"
                    id="FirstName"
                    name="FirstName"
                    onChange={this.onChange}
                    value={this.state.model.FirstName}
                  />

                  <label class="form-label">*Last Name</label>
                  <input
                    className="k-textbox"
                    id="LastName"
                    name="LastName"
                    onChange={this.onChange}
                    value={this.state.model.LastName}
                  />

                  <label class="form-label">*Email</label>
                  <input
                    className="k-textbox"
                    id="Email"
                    name="Email"
                    onChange={this.onChange}
                    value={this.state.model.Email}
                  />

                  <label class="form-label">*Contact Number</label>
                  <MaskedTextBox
                    mask="(999) 999-9999"
                    id="ContactNumber"
                    name="ContactNumber"
                    onChange={this.onChange}
                    value={this.state.model.ContactNumber}
                  />
                </div>
                <div className="col-md-6">
                  <label class="form-label">*Country</label>
                  <DropDownList
                    data={this.state.countries}
                    textField="Description"
                    onFilterChange={this.filterChange}
                    onChange={async (e) => {
                      await this.loadProvince(e.value.Id);
                      this.setState({
                        model: {
                          ...this.state.model,
                          CountryId: e.value.Id,
                        },
                      });
                    }}
                  />
                  <label class="form-label">*Province</label>
                  <DropDownList
                    data={this.state.provinces}
                    textField="Description"
                    onFilterChange={this.filterChange}
                    onChange={(e) => {
                      this.setState({
                        model: {
                          ...this.state.model,
                          ProvinceId: e.value.Id,
                        },
                      });
                    }}
                  />
                  <label class="form-label">*City</label>
                  <input
                    className="k-textbox"
                    id="City"
                    name="City"
                    onChange={this.onChange}
                    value={this.state.model.City}
                  />
                  <label class="form-label">*Postal Code</label>
                  <input
                    className="k-textbox"
                    id="PostalCode"
                    name="PostalCode"
                    onChange={this.onChange}
                    value={this.state.model.PostalCode}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12">
                  <label>Account Information</label>
                </div>
                <div className="col-md-12">
                  <div class="row">
                    <div class="col-md-6 col-12">
                      <label class="form-label">*User Type</label>
                      <DropDownList
                        data={this.state.userType}
                        disabled={true}
                        textField="Description"
                        filterable={true}
                        onFilterChange={this.filterChange}
                        value={{
                          Id: 1,
                          Description: "Admin",
                        }}
                        onChange={async (e) => {
                          this.setState({
                            model: {
                              ...this.state.model,
                              UserTypeId: e.value.Id,
                            },
                          });
                        }}
                      />

                      <label class="form-label">*Username</label>
                      <input
                        className="k-textbox"
                        id="Username"
                        name="Username"
                        onChange={this.onChange}
                        value={this.state.model.Username}
                      />
                    </div>
                    <div class="col-md-6 col-12">
                      <label class="form-label">*Password</label>
                      <input
                        className="k-textbox"
                        id="Password"
                        name="Password"
                        type="password"
                        onChange={this.onChange}
                        onBlur={(e) => {
                          if (
                            e.target.value !==
                              this.state.model.ConfirmPassword &&
                            this.state.model.ConfirmPassword !== ""
                          ) {
                            this.setState({
                              error: {
                                IsSuccess: false,
                                Message: "Password mismatch",
                                windowHeight: 800,
                              },
                            });
                          } else {
                            this.setState({
                              error: {
                                IsSuccess: true,
                                Message: "",
                                windowHeight: 720,
                              },
                            });
                          }
                        }}
                        value={this.state.model.Password}
                      />

                      <label class="form-label">*Confirm Password</label>
                      <input
                        className="k-textbox"
                        id="ConfirmPassword"
                        name="ConfirmPassword"
                        onChange={this.onChange}
                        onBlur={(e) => {
                          if (
                            e.target.value !== this.state.model.Password &&
                            this.state.model.Password !== ""
                          ) {
                            this.setState({
                              error: {
                                IsSuccess: false,
                                Message: "Password mismatch",
                                windowHeight: 800,
                              },
                            });
                          } else {
                            this.setState({
                              error: {
                                IsSuccess: true,
                                Message: "",
                                windowHeight: 720,
                              },
                            });
                          }
                        }}
                        type="password"
                        value={this.state.model.ConfirmPassword}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={this.onSubmitPress}
            disabled={
              this.state.model.FirstName === "" ||
              this.state.model.LastName === "" ||
              this.state.model.Email === "" ||
              this.state.model.ContactNumber === "" ||
              this.state.model.CountryId === 0 ||
              this.state.model.ProvinceId === 0 ||
              this.state.model.City === "" ||
              this.state.model.PostalCode === "" ||
              this.state.model.UserTypeId === 0 ||
              this.state.model.Username === "" ||
              this.state.model.Password === "" ||
              this.state.model.ConfirmPassword === "" ||
              this.state.model.ConfirmPassword !== this.state.model.Password ||
              !this.state.error.IsSuccess
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UserFormModal);
