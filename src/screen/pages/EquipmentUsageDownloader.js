import { DropDownList } from "@progress/kendo-react-dropdowns";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  GetLastUsageDataOfGateway,
  SaveGatewayUsage,
} from "../../apiService/equipmentAPI";
import { ListAvailableEquipment } from "../../apiService/lookUpAPI";
import moment from "moment";

class EquipmentUsageDownloader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      equipments: [],
      selectedEquipment: {},
      selectedLastUsageDate: {},
      downloadedUsage: [],
      isCompleted: false,
      daysCompleted: 0,
      totalDaysToComplete:0
    };
  }

  async componentDidMount() {
    var result = await ListAvailableEquipment();
    this.setState({
      equipments: result,
    });
  }

  onEquipmentChange = async (e) => {
    this.setState({
      selectedEquipment: e.value,
    });
    if (e.value.GatewayId) {
      var result = await GetLastUsageDataOfGateway(e.value.GatewayId);
      let dateTo = moment(result.DateTo);
      let today = moment(new Date()).diff(dateTo,"days");
      this.setState({
        selectedLastUsageDate: result,
        totalDaysToComplete: today
      });
    }
  };

  startDownload = async () => {
    this.setState({ isCompleted: false });
    let dateTo = moment(this.state.selectedLastUsageDate.DateTo);
    let today = moment(new Date()).diff(dateTo,"days");
    for (var d = 0; d <= today; d++) {
      for (var h = 0; h <= 23; h++) {
        var dtString = dateTo.format("MM/DD/YYYY HH:00:00");
        var from = moment(dtString)
          .add(d, "days")
          .add(h, "hour")
          .format("MM/DD/YYYY HH:00:00");
        var to = moment(dtString)
          .add(d, "days")
          .add(h + 1, "hour")
          .format("MM/DD/YYYY HH:00:00");

        var isSuccess = false;
        while (!isSuccess) {
          var result = await SaveGatewayUsage(
            this.state.selectedEquipment.GatewayId,
            from,
            to
          );
          isSuccess = result.IsSuccess;
          let logs = [...this.state.downloadedUsage];
          if (logs.length > 24) {
            logs = [];
          }

          logs.push(`${from} - ${to} IsSuccess: ${isSuccess}`);
          this.setState({ downloadedUsage: logs });
        }
      }
      this.setState({ daysCompleted: d, totalDaysToComplete: this.state.totalDaysToComplete - 1  });
    }
    alert("DONE");
    this.setState({ isCompleted: true });
  };

  render() {
    return (
      <div class="col-4">
        <DropDownList
          label="Equipments"
          value={this.state.selectedEquipment}
          data={this.state.equipments}
          textField="Description"
          style={{ width: "100%" }}
          onChange={this.onEquipmentChange}
        />
        <div class="row mt-3">
          <div class="col-6">
            <label>
              Last Download:
              {moment(this.state.selectedLastUsageDate.DateTo).format(
                " MMM DD, yyyy hh:mm:ss"
              )}
            </label>
          </div>
          <div class="col-6">
            <button
              class="btn btn-primary float-right"
              onClick={this.startDownload}
            >
              Start Download
            </button>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12">
            <label>Days To Completed: </label> {this.state.totalDaysToComplete} <br/>
            <label>Days Completed: </label> {this.state.daysCompleted}
          </div>
          {this.state.isCompleted ? (
            <div class="col-12">
              <div class="alert alert-success">
                <label>Done!</label>
              </div>
            </div>
          ) : null}
          <div class="col-12">
            <select
              class="form-control"
              multiple={true}
              style={{ height: 600 }}
            >
              {this.state.downloadedUsage.map((du) => (
                <option>{du}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EquipmentUsageDownloader);
