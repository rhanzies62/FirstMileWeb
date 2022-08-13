import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Chart,
  ChartTitle,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisTitle,
  ChartCategoryAxisItem,
  ChartTooltip,
  ChartSeriesItemTooltip,
  ChartLegend,
} from "@progress/kendo-react-charts";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { DatePicker, TimePicker } from "@progress/kendo-react-dateinputs";
import { fileSizeConverter } from "../../../commonService";
import { GetGatewayUsage, GetSourceUsage } from "../../../apiService/lookUpAPI";
import FmLoadingScreen from "../../components/FmLoadingScreen";
import moment from "moment";

class UsageDetailsCard extends Component {
  constructor(props) {
    super(props);
    this.step = {
      hour: 1,
      minute: 60,
      second: 0,
    };
    this.state = {
      selectedTab: 0,
      isLoading: false,
      totalUsagePerDays: [],
      totalCellUsagePerDays: [],
      totalOtherUsagePerDays: [],
      categories: [],
      selectedEquipment: {},
      equipmentUsage: {
        TotalCellUsage: 0,
        OtherUsage: 0,
        TotalUsage: 0,
      },
    };
  }

  async componentDidMount() {
    console.log(this.props.selectedEquipment);
    if (this.props.selectedEquipment.EquipmentId) {
      this.setState(
        {
          selectedEquipment: this.props.selectedEquipment,
        },
        async () => {
          await this.viewDetails();
        }
      );
    }
  }

  async componentDidUpdate(prevProps) {
    console.log(this.props.selectedEquipment);
    if (this.props.selectedEquipment.EquipmentId) {
      if (prevProps !== this.props) {
        this.setState(
          { selectedEquipment: this.props.selectedEquipment },
          async () => {
            await this.viewDetails();
          }
        );
      }
    }
  }

  onTabClick = async ({ selected }) => {
    this.setState({ selectedTab: selected });
    if (this.props.selectedEquipment.EquipmentId) {
      if (selected === 1) {
        await this.viewHourlyDetails();
      } else {
        await this.viewDetails(this.props.selectedEquipment);
      }
    }
  };

  viewDetails = async () => {
    if (this.state.selectedTab === 0) {
      const from = moment(this.props.fromDate);
      const to = moment(this.props.toDate);
      const diff = to.diff(from, "days");
      let totalUsage = [];
      let cellUsage = [];
      let otherUsage = [];
      let categories = [];
      let totalusages = 0;
      let cellusages = 0;
      let otherusages = 0;

      this.setState({ isLoading: true });

      for (let i = 0; i <= diff; i++) {
        let newDate = moment(this.props.fromDate).add(i, "days");
        const dayfrom = `${newDate.format("MM/DD/YYYY")} 00:00:00`;
        const dayTo = `${moment(newDate.format("MM/DD/YYYY")).add(1,"days").format("MM/DD/YYYY")} 00:00:00`;
        if(this.props.selectedEquipment.TypeId === 3){
          const usage = await GetGatewayUsage(
            this.props.selectedEquipment.GatewayId,
            dayfrom,
            dayTo
          );
          totalusages += usage.total_usage;
          totalUsage.push(fileSizeConverter(usage.total_usage, true));
  
          cellusages += usage.cell_usage;
          cellUsage.push(fileSizeConverter(usage.cell_usage, true));
  
          otherusages += usage.total_usage - usage.cell_usage;
          otherUsage.push(
            fileSizeConverter(usage.total_usage - usage.cell_usage, true)
          );
        } else if(this.props.selectedEquipment.TypeId === 1){
          const usage = await GetSourceUsage(
            this.props.selectedEquipment.GatewayId,
            dayfrom,
            dayTo
          );
          totalusages += usage.totalUsage;
          totalUsage.push(fileSizeConverter(usage.totalUsage, true));
  
          cellusages += usage.totalCellUsage;
          cellUsage.push(fileSizeConverter(usage.totalCellUsage, true));
  
          otherusages += usage.TotalUsage - usage.totalCellUsage;
          otherUsage.push(
            fileSizeConverter(usage.TotalUsage - usage.totalCellUsage, true)
          );
        }

        categories.push(newDate.format("MM/DD"));
      }
      this.setState({
        categoryText: `${moment(this.props.fromDate).format(
          "MMM DD, YYYY"
        )} - ${moment(this.props.toDate).format("MMM DD, YYYY")}`,
        totalUsagePerDays: totalUsage,
        totalCellUsagePerDays: cellUsage,
        totalOtherUsagePerDays: otherUsage,
        categories,
        isLoading: false,
        equipmentUsage: {
          TotalCellUsage: cellusages,
          OtherUsage: otherusages,
          TotalUsage: totalusages,
        },
      },()=>{
        console.log(this.state);
      });
    } else {
      await this.viewHourlyDetails();
    }
  };

  viewHourlyDetails = async () => {
    if (this.props.selectedEquipment.EquipmentId) {
      this.setState({ isLoading: true });
      const fromTime = moment(this.props.fromTime);
      const toTime =
        moment(this.props.toTime).format("HH") === "00"
          ? moment(
              new Date(
                `${moment(new Date("1/1/2020"))
                  .add(1, "days")
                  .format("MM/DD/YYYY")} 00:00:00`
              )
            )
          : moment(this.props.toTime);

      const diff = toTime.diff(fromTime, "hours");
      let totalUsage = [];
      let cellUsage = [];
      let otherUsage = [];
      let categories = [];

      let totalusages = 0;
      let cellusages = 0;
      let otherusages = 0;

      for (let i = 0; i <= diff - 1; i++) {
        let fromDate = `${moment(this.props.selectedDate).format(
          "MM/DD/YYYY"
        )} ${moment(this.props.fromTime).add(i, "hour").format("HH")}:00:00`;
        let toDate = `${moment(this.props.selectedDate).format(
          "MM/DD/YYYY"
        )} ${moment(this.props.fromTime)
          .add(i + 1, "hour")
          .format("HH")}:00:00`;

        if(this.props.selectedEquipment.TypeId === 3){
          const usage = await GetGatewayUsage(
            this.props.selectedEquipment.GatewayId,
            fromDate,
            toDate
          );

          totalusages += usage.total_usage;
          totalUsage.push(fileSizeConverter(usage.total_usage, true));

          cellusages += usage.cell_usage;
          cellUsage.push(fileSizeConverter(usage.cell_usage, true));

          otherusages += usage.total_usage - usage.cell_usage;
          otherUsage.push(
            fileSizeConverter(usage.total_usage - usage.cell_usage, true)
          );
        } else if(this.props.selectedEquipment.TypeId === 1){
          const usage = await GetSourceUsage(
            this.props.selectedEquipment.GatewayId,
            fromDate,
            toDate
          );
          totalusages += usage.totalUsage;
          totalUsage.push(fileSizeConverter(usage.totalUsage, true));
  
          cellusages += usage.totalCellUsage;
          cellUsage.push(fileSizeConverter(usage.totalCellUsage, true));
  
          otherusages += usage.TotalUsage - usage.totalCellUsage;
          otherUsage.push(
            fileSizeConverter(usage.TotalUsage - usage.totalCellUsage, true)
          );
        }

        categories.push(`${moment(fromDate).format("HH")}:00`);
      }
      this.setState({
        categoryText: `${moment(this.props.fromTime).format(
          "HH:MM:SS"
        )} - ${moment(this.props.toTime).format("HH:MM:SS")}`,
        totalUsagePerDays: totalUsage,
        totalCellUsagePerDays: cellUsage,
        totalOtherUsagePerDays: otherUsage,
        categories,
        isLoading: false,
        equipmentUsage: {
          TotalCellUsage: cellusages,
          OtherUsage: otherusages,
          TotalUsage: totalusages,
        },
      });
    }
  };

  render() {
    const { selectedEquipment, equipmentUsage } = this.state;
    return (
      <>
        <FmLoadingScreen isLoading={this.state.isLoading} />
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="col-12 mb-4">
              <div class="card shadow-sm">
                {selectedEquipment.EquipmentId ? (
                  <div class="card-body">
                    <h5 class="card-title py-0 my-0">
                      <i class="icon-tools"></i> {selectedEquipment.Name}
                    </h5>
                    <h6 class="card-title py-0 my-0 text-muted">
                      <i class="icon-barcode"></i> {selectedEquipment.Serial}
                    </h6>
                    <div class="row mt-3">
                      <div class="col-12 col-md-4 text-center mb-3">
                        <h4>
                          {fileSizeConverter(equipmentUsage.TotalCellUsage)}
                        </h4>
                        <h6 class="card-title py-0 my-0 font-weight-normal">
                          <span class="text-right">
                            <i class="icon-phone4"></i> Cell Usage
                          </span>
                        </h6>
                      </div>
                      <div class="col-12 col-md-4 text-center mb-3">
                        <h4>{fileSizeConverter(equipmentUsage.OtherUsage)}</h4>
                        <h6 class="card-title py-0 my-0 font-weight-normal">
                          <span class="text-right">
                            <i class="icon-devices_other"></i> Other Usage
                          </span>
                        </h6>
                      </div>
                      <div class="col-12 col-md-4 text-center mb-3">
                        <h4>{fileSizeConverter(equipmentUsage.TotalUsage)}</h4>
                        <h6 class="card-title py-0 my-0 font-weight-normal">
                          <span class="text-right">
                            <i class="icon-data_usage"></i> Total Usage
                          </span>
                        </h6>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div class="card-body">
                    <div class="row">
                      <div class="col-12 text-center">
                        <label class="text-muted">
                          Choose an equipment to view the Details
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div class="row">
              <div class="col-12">
                <TabStrip
                  selected={this.state.selectedTab}
                  onSelect={this.onTabClick}
                >
                  <TabStripTab
                    title={
                      <label class="p-0 m-0">
                        <i class="icon-calendar"></i> Daily
                      </label>
                    }
                  ></TabStripTab>
                  <TabStripTab
                    title={
                      <label class="p-0 m-0">
                        <i class="icon-clock1"></i> Hourly
                      </label>
                    }
                  >
                    <div class="row">
                      <div class="col-12">
                        <div class="row">
                          <div class="col-4">
                            <label>Select a Date</label>
                          </div>
                          <div class="col-4">
                            <label>Start Time</label>
                          </div>
                          <div class="col-4">
                            <label>End Time</label>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-4">
                            <DatePicker
                              className="w-100"
                              value={this.props.selectedDate}
                              name="selectedDate"
                              onChange={this.props.onChange}
                              max={this.props.toDate}
                              min={this.props.fromDate}
                            />
                          </div>
                          <div class="col-4">
                            <TimePicker
                              className="w-100"
                              steps={this.step}
                              name="fromTime"
                              value={this.props.fromTime}
                              onChange={this.props.onChange}
                            />
                          </div>
                          <div class="col-4">
                            <TimePicker
                              className="w-100"
                              steps={this.step}
                              name="toTime"
                              value={this.props.toTime}
                              onChange={this.props.onChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabStripTab>
                </TabStrip>

                <Chart>
                  <ChartTitle
                    text={
                      this.state.selectedTab === 0
                        ? "Daily Usage"
                        : "Hourly Usage"
                    }
                  />
                  <ChartTooltip />
                  <ChartLegend position="bottom" orientation="horizontal" />
                  <ChartCategoryAxis>
                    <ChartCategoryAxisItem categories={this.state.categories}>
                      <ChartCategoryAxisTitle text={this.state.categoryText} />
                    </ChartCategoryAxisItem>
                  </ChartCategoryAxis>
                  <ChartSeries>
                    <ChartSeriesItem
                      name="Cell Usage"
                      type="column"
                      data={this.state.totalCellUsagePerDays}
                    >
                      <ChartSeriesItemTooltip format="{0} Gb" />
                    </ChartSeriesItem>
                    <ChartSeriesItem
                      name="Other Usage"
                      type="column"
                      data={this.state.totalOtherUsagePerDays}
                    >
                      <ChartSeriesItemTooltip format="{0} Gb" />
                    </ChartSeriesItem>
                    <ChartSeriesItem
                      name="Total Usage"
                      type="column"
                      data={this.state.totalUsagePerDays}
                    >
                      <ChartSeriesItemTooltip format="{0} Gb" />
                    </ChartSeriesItem>
                  </ChartSeries>
                </Chart>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UsageDetailsCard);
