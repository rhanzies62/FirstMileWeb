import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { ListAvailableEngo } from "../../apiService/equipmentAPI";
import { AddEditMeili, ListAllMeilie, ListUserMeilie } from "../../apiService/userAPI";

export class CustomerMeiliPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      engoEquipments: [],
      subscriptionList: [
        { id: 1, name: "Weekly" },
        { id: 2, name: "Monthly" },
        { id: 3, name: "Yearly" },
      ],
      CameraList: [
        { id: 1, name: "Arri Alexa Mini LF" },
        { id: 2, name: "Arri Amira" },
        { id: 3, name: "RED DSMC1" },
        { id: 4, name: "RED DSMC2" },
        { id: 5, name: "Sony Venice" },
      ],
      FileDestination: [
        { id: 1, name: "Existing Frame.io" },
        { id: 2, name: "Matrx" },
        { id: 3, name: "Blackbird" },
        { id: 5, name: "Sony Venice"},
        // { id: 4, name: "Custom destination (please specify)" },
      ],
      Encoders: [
        { id: 1, name: "Existing EnGo Encoder " },
        { id: 2, name: "Haivision" },
        { id: 3, name: "AviWest" },
        // { id: 4, name: "Other (please specify)" },
      ],
      meiliModel: {
        MeiliId: 0,
        EquipmentId: 0,
        SubscriptionId: 0,
        CameraId: 0,
        FileDestination: 0,
        ProjectName: "",
        EncoderId: 0,
      },
      showModal: false,
      meilieData: {
        data: [],
        totalCount: 0,
      },
      filter: {
        Take: 10,
        Skip: 0,
        Field: "MeiliId",
        Direction: "desc",
        Searchs: [],
      },
      sort: ["asc", "desc"],
      showMeiliDetailsModal: false
    };
  }

  async componentDidMount() {
    console.log(this.props);
    await this.listMeili();
    var result = await ListAvailableEngo();
    this.setState({
      engoEquipments: result,
    });
  }

  listMeili = async () => {
    var data = this.props.auth.userType === "1" ? await ListAllMeilie(this.state.filter) :  await ListUserMeilie(this.state.filter);
    this.setState({
      meilieData: {
        data: data.Data,
        totalCount: data.TotalCount,
      },
    });
  };

  onChange = (e) => {
    this.updateModel(e.target.name, e.target.value);
  };

  updateModel = (name, value,selecteddp,selecteddpvalue) => {
    this.setState({
      meiliModel: {
        ...this.state.meiliModel,
        [name]: value,
        [selecteddp]: selecteddpvalue
      },
    });
  };

  submitMeili = async () => {
    await AddEditMeili(this.state.meiliModel);
    this.setState({
      showModal:false
    });
    await this.listMeili();
  };

  LookUpCell = (id, lookuplist) => {
    var result = this.state[lookuplist].find((i) => i.id === id);
    return <td>{result ? result.name || "" : ""}</td>;
  };
  
  lookUpDropdownValue = (id, lookuplist) => {
    var result = this.state[lookuplist].find((i) => i.id === id || i.EquipmentId === id);
    return result;
  };

  displayDateString = (value) => {
    return <td>{value}</td>;
  }

  render() {
    return (
      <>
        <div class="row">
          <div class="col-12 mb-2">
            {this.props.auth.userType === "1" ? null : <button
              class="btn btn-primary float-right"
              onClick={() => {
                this.setState({ showModal: true });
              }}
            >
              Add Meili Project
            </button>}
          </div>
          <div class="col-12">
            <Grid
              data={this.state.meilieData.data}
              onRowClick={({ dataItem }) => {
                if(this.props.auth.userType !== "1"){
                  if(dataItem.StatusId === 3){
                    this.setState({
                      showMeiliDetailsModal: true
                    });
                  } else {
                    this.setState({
                      meiliModel: {
                        ...dataItem,
                        selectedEquipment: this.lookUpDropdownValue(dataItem.EquipmentId,"engoEquipments"),
                        selectedSubscription: this.lookUpDropdownValue(dataItem.SubscriptionId,"subscriptionList"),
                        selectedCamera: this.lookUpDropdownValue(dataItem.CameraId, "CameraList"),
                        selectedFileDestination: this.lookUpDropdownValue(dataItem.FileDestination,"FileDestination"),
                        selectedEncoders: this.lookUpDropdownValue(dataItem.EncoderId, "Encoders")
                      },
                      showModal: true
                    });
                  }
                }
                //this.editRow(dataItem);
              }}
              sortable={true}
              pageable={true}
              total={this.state.meilieData.totalCount}
              take={this.state.filter.Take}
              skip={this.state.filter.Skip}
              sort={this.state.sort}
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
                    await this.listMeili();
                  }
                );
              }}
              onSortChange={(e) => {
                console.log(e.sort);
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
                    await this.listMeili();
                  }
                );
              }}
            >
              <Column
                field="MeiliId"
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
              <Column
                field="Name"
                title="Equipment Name"
                filter={"text"}
                // columnMenu={ColumnMenu}
              />
              <Column
                field="SubscriptionId"
                title="Subscription Type"
                cell={(props) => {
                  return this.LookUpCell(
                    props.dataItem.SubscriptionId,
                    "subscriptionList"
                  );
                }}
              />
              <Column
                field="CameraId"
                title="Camera Type"
                cell={(props) => {
                  return this.LookUpCell(props.dataItem.CameraId, "CameraList");
                }}
              />
              <Column
                field="FileDestination"
                title="File Destination"
                cell={(props) => {
                  return this.LookUpCell(
                    props.dataItem.FileDestination,
                    "FileDestination"
                  );
                }}
              />
              <Column
                field="EncoderId"
                title="Encoder"
                cell={(props) => {
                  return this.LookUpCell(props.dataItem.EncoderId, "Encoders");
                }}
              />
              <Column
                field="CreatedDate"
                title="Created Date"
                filter={"text"}
                cell={(props) => {
                  return this.displayDateString(props.dataItem.CreatedDateString);
                }}
                // columnMenu={ColumnMenu}
              />
              <Column
                field="UpdatedDate"
                title="Updated Date"
                filter={"text"}
                cell={(props) => {
                  return this.displayDateString(props.dataItem.UpdatedDateString);
                }}
                // columnMenu={ColumnMenu}
              />
              <Column 
                field="StatusId"
                title="Status"
                filter={"text"}
                cell={(props) => {
                  if(props.dataItem.StatusId === 0) return <td>Inactive</td>;
                  if(props.dataItem.StatusId === 1) return <td>Pending</td>;
                  if(props.dataItem.StatusId === 2) return <td>Processing</td>;
                  if(props.dataItem.StatusId === 3) return <td>Active</td>;
                  if(props.dataItem.StatusId === 4) return <td>Inactive</td>;
                }}
              />
            </Grid>
          </div>
        </div>
        <Modal
          show={this.state.showModal}
          onHide={() => {
            this.setState({ showModal: false });
          }}
          data-focus="false"
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Job Request</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="container">
              <form className="k-form">
                <div class="col-12">
                  <fieldset>
                    <label class="form-label">Project Name</label>
                    <input
                      className="k-textbox"
                      name="ProjectName"
                      onChange={this.onChange}
                      value={this.state.meiliModel.ProjectName}
                    />
                  </fieldset>
                </div>
                <div class="col-12">
                  <fieldset>
                    <label className="k-form-field">
                      {this.state.engoEquipments.length > 0 ? (
                        <DropDownList
                          label="Engo Equipment"
                          data={this.state.engoEquipments}
                          textField="Name"
                          value={this.state.meiliModel.selectedEquipment}
                          onChange={(e) => {
                            this.updateModel("EquipmentId",e.value.EquipmentId,"selectedEquipment",e.value);
                          }}
                        />
                      ) : null}
                    </label>
                  </fieldset>
                </div>
                <div class="col-12">
                  <fieldset>
                    <label className="k-form-field">
                      <DropDownList
                        data={this.state.subscriptionList}
                        label="Subscrition Length"
                        textField="name"
                        value={this.state.meiliModel.selectedSubscription}
                        onChange={(e) => {
                          this.updateModel("SubscriptionId", e.value.id,"selectedSubscription",e.value);
                        }}
                      />
                    </label>
                  </fieldset>
                </div>
                <div class="col-12">
                  <fieldset>
                    <label className="k-form-field">
                      <DropDownList
                        label="Camera"
                        data={this.state.CameraList}
                        value={this.state.meiliModel.selectedCamera}
                        textField="name"
                        onChange={(e) => {
                          this.updateModel("CameraId", e.value.id,"selectedCamera",e.value);
                        }}
                      />
                    </label>
                  </fieldset>
                </div>
                <div class="col-12">
                  <fieldset>
                    <label className="k-form-field">
                      <DropDownList
                        label="File Destination"
                        data={this.state.FileDestination}
                        value={this.state.meiliModel.selectedFileDestination}
                        textField="name"
                        onChange={(e) => {
                          this.updateModel("FileDestination", e.value.id,"selectedFileDestination",e.value);
                        }}
                      />
                    </label>
                  </fieldset>
                </div>
                <div class="col-12">
                  <fieldset>
                    <label className="k-form-field">
                      <DropDownList
                        label="Encoder"
                        data={this.state.Encoders}
                        value={this.state.meiliModel.selectedEncoders}
                        textField="name"
                        onChange={(e) => {
                          this.updateModel("EncoderId", e.value.id,"selectedEncoders",e.value);
                        }}
                      />
                    </label>
                  </fieldset>
                </div>
              </form>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.submitMeili}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          size="lg"
          show={this.state.showMeiliDetailsModal}
          onHide={() => {
            this.setState({ showMeiliDetailsModal: false });
          }}
          data-focus="false"
          backdrop="static"
          keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Job Request Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="container">
              <div class="col-8">

              </div>
              <div class="col-4"></div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { this.setState({ showMeiliDetailsModal: false }); }}>
                Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerMeiliPage);
