import React, { Component } from "react";
import { connect } from "react-redux";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";

import LocationPage from "./LocationPage";
import EquipmentUsagePage from "./EquipmentUsagePage";
import SchedulerPage from "./SchedulerPage";

class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
    };
  }

  handleSelect = (e) => {
    this.setState({ selected: e.selected });
  };

  render() {
    return (
      <>
        <div class="row">
          <div class="col-12">
            <TabStrip
              selected={this.state.selected}
              onSelect={this.handleSelect}
            >
              <TabStripTab
                title={
                  <h6 class="p-0 m-0">
                    <i class="icon-clock1"></i> Schedules
                  </h6>
                }
              >
                <SchedulerPage />
              </TabStripTab>
              <TabStripTab
                title={
                  <h6 class="p-0 m-0">
                    <i class="icon-pin_drop"></i> Locations
                  </h6>
                }
                class="locationtab"
              >
                <LocationPage />
              </TabStripTab>
              <TabStripTab
                title={
                  <h6 class="p-0 m-0">
                    <i class="icon-sd_storage"></i> Usages
                  </h6>
                }
              >
                <EquipmentUsagePage />
              </TabStripTab>
            </TabStrip>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
