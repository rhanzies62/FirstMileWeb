import React, { Component } from "react";
import { connect } from "react-redux";
import { GetUserBooking } from "../../apiService/bookingAPI";
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
import moment from "moment";
import { fileSizeConverter } from "../../commonService";
import { DatePicker, TimePicker } from "@progress/kendo-react-dateinputs";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { GetGatewayUsage, GetSourceUsage } from "../../apiService/lookUpAPI";
import FmLoadingScreen from "../components/FmLoadingScreen";

class UserEquipmentUsage extends Component {
  constructor(props) {
    super(props);
    this.step = {
      hour: 1,
      minute: 60,
      second: 0,
    };
    this.state = {
      isLoading: false,
      bookingEquipment: {},
      selectedTab: 0,
      selectedDate: new Date(),
      fromDate: new Date(),
      fromTime: new Date("1/1/2020 00:00:00"),
      toDate: new Date(),
      toTime: new Date(`1/1/2020 ${moment(new Date()).format("HH")}:00:00`),
    };
  }

  onTabClick = async ({ selected }) => {
    this.setState({ selectedTab: selected });
    if (selected === 0) await this.viewDaily();
    else await this.viewHourly();
  };

  onChange = async (e) => {
    let targetName = e.target.name;
    this.setState(
      {
        [targetName]: e.target.value,
      },
      async () => {
        if (this.state.selectedTab === 0) await this.viewDaily();
        else await this.viewHourly();
      }
    );
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    const result = await GetUserBooking(
      this.props.equipmentid,
      this.props.salesid
    );
    this.setState({
      isLoading: false,
      bookingEquipment: result,
      fromDate: new Date(result.BorrowedDateFrom),
      toDate:
        moment(result.BorrowedDateTo) > moment(new Date())
          ? new Date()
          : new Date(result.BorrowedDateTo),
    });
    await this.viewDaily();
  }

  viewHourly = async () => {
    this.setState({ isLoading: true });
    const fromTime = moment(this.state.fromTime);
    const toTime = moment(this.state.toTime);
    const diff = toTime.diff(fromTime, "hours");

    let totalUsage = [];
    let cellUsage = [];
    let otherUsage = [];
    let categories = [];

    let total = 0;
    let other = 0;
    let cell = 0;

    for (let i = 0; i <= diff - 1; i++) {
      let fromDate = `${moment(this.state.selectedDate).format(
        "MM/DD/YYYY"
      )} ${moment(this.state.fromTime).add(i, "hour").format("HH")}:00:00`;
      let toDate = `${moment(this.state.selectedDate).format(
        "MM/DD/YYYY"
      )} ${moment(this.state.fromTime)
        .add(i + 1, "hour")
        .format("HH")}:00:00`;

    console.log(this.state.bookingEquipment.Equipment.TypeId);
    if(this.state.bookingEquipment.Equipment.TypeId === 3) {
      const usage = await GetGatewayUsage(
        this.state.bookingEquipment.Equipment.GatewayId,
        fromDate,
        toDate
      );

      total += usage.total_usage;
      cell += usage.cell_usage;
      other += usage.total_usage - usage.cell_usage;

      totalUsage.push(fileSizeConverter(usage.total_usage, true));
      cellUsage.push(fileSizeConverter(usage.cell_usage, true));
      otherUsage.push(fileSizeConverter(usage.total_usage - usage.cell_usage, true));
    }
    
    if(this.state.bookingEquipment.Equipment.TypeId === 1) {
      const usage = await GetSourceUsage(
        this.state.bookingEquipment.Equipment.GatewayId,
        fromDate,
        toDate
      );

      total += usage.totalUsage;
      cell += usage.totalCellUsage;
      other += usage.totalUsage - usage.totalCellUsage;

      totalUsage.push(fileSizeConverter(usage.totalUsage, true));
      cellUsage.push(fileSizeConverter(usage.totalCellUsage, true));
      otherUsage.push(fileSizeConverter(usage.totalUsage - usage.totalCellUsage, true));
    }


      categories.push(moment(fromDate).format("HH"));
    }
    this.setState({
      categoryText: `${moment(this.state.fromTime).format(
        "HH:MM:SS"
      )} - ${moment(this.state.toTime).format("HH:MM:SS")}`,
      totalUsagePerDays: totalUsage,
      totalCellUsagePerDays: cellUsage,
      totalOtherUsagePerDays: otherUsage,
      categories,
      isLoading: false,
      bookingEquipment: {
        ...this.state.bookingEquipment,
        TotalCellUsage: cell,
        OtherUsage: other,
        TotalUsage: total,
      },
    });
  };

  viewDaily = async () => {
    this.setState({ isLoading: true });
    const from = moment(this.state.fromDate);
    const to = moment(this.state.toDate);
    const diff = to.diff(from, "days");
    let totalUsage = [];
    let cellUsage = [];
    let otherUsage = [];
    let categories = [];

    let total = 0;
    let other = 0;
    let cell = 0;

    for (let i = 0; i <= diff; i++) {
      let newDate = moment(this.state.fromDate).add(i, "days");
      const dayfrom = `${newDate.format("MM/DD/YYYY")} 00:00:00`;
      const dayTo = `${newDate.format("MM/DD/YYYY")} 23:59:59`;
      if(this.state.bookingEquipment.Equipment.TypeId === 3){
        const usage = await GetGatewayUsage(
          this.state.bookingEquipment.Equipment.GatewayId,
          dayfrom,
          dayTo
        );
        total += usage.total_usage;
        cell += usage.cell_usage;
        other += usage.total_usage - usage.cell_usage;
        totalUsage.push(fileSizeConverter(usage.total_usage, true));
        cellUsage.push(fileSizeConverter(usage.cell_usage, true));
        otherUsage.push(
          fileSizeConverter(usage.total_usage - usage.cell_usage, true)
        );
      }
      if(this.state.bookingEquipment.Equipment.TypeId === 1) {
        const usage = await GetSourceUsage(
          this.state.bookingEquipment.Equipment.GatewayId,
          dayfrom,
          dayTo
        );
  
        total += usage.totalUsage;
        cell += usage.totalCellUsage;
        other += usage.totalUsage - usage.totalCellUsage;
  
        totalUsage.push(fileSizeConverter(usage.totalUsage, true));
        cellUsage.push(fileSizeConverter(usage.totalCellUsage, true));
        otherUsage.push(fileSizeConverter(usage.totalUsage - usage.totalCellUsage, true));
      }
      categories.push(newDate.format("MM/DD"));
    }

    this.setState({
      isLoading: false,
      categoryText: `${moment(this.state.fromDate).format(
        "MMM DD, YYYY"
      )} - ${moment(this.state.toDate).format("MMM DD, YYYY")}`,
      totalUsagePerDays: totalUsage,
      totalCellUsagePerDays: cellUsage,
      totalOtherUsagePerDays: otherUsage,
      categories,
      bookingEquipment: {
        ...this.state.bookingEquipment,
        TotalCellUsage: cell,
        OtherUsage: other,
        TotalUsage: total,
      },
    });
  };

  render() {
    return (
      <>
        <FmLoadingScreen isLoading={this.state.isLoading} />
        <div class="card shadow-sm">
          {this.state.bookingEquipment.Equipment ? (
            <div class="card-body px-0">
              <div class="col-12 mb-4">
                <div class="card shadow-sm">
                  <div class="card-body">
                    <h5 class="card-title py-0 my-0">
                      <i class="icon-tools"></i>{" "}
                      {this.state.bookingEquipment.Equipment.Name}
                    </h5>
                    <h6 class="card-title py-0 my-0 text-muted">
                      <i class="icon-barcode"></i>{" "}
                      {this.state.bookingEquipment.Equipment.Serial}
                    </h6>
                    <div class="row mt-3 px-0">
                      <div class="col-6 col-md-4 mt-2 text-center">
                        <h4>
                          {fileSizeConverter(
                            this.state.bookingEquipment.TotalCellUsage
                          )}
                        </h4>
                        <h6 class="card-title py-0 my-0 font-weight-normal">
                          <span class="text-right">
                            <i class="icon-phone4"></i> Cell
                          </span>
                        </h6>
                      </div>
                      <div class="col-6 col-md-4 mt-2 text-center">
                        <h4>
                          {fileSizeConverter(
                            this.state.bookingEquipment.OtherUsage
                          )}
                        </h4>
                        <h6 class="card-title py-0 my-0 font-weight-normal">
                          <span class="text-right">
                            <i class="icon-devices_other"></i> Other
                          </span>
                        </h6>
                      </div>
                      <div class="col-12 col-md-4 mt-3 text-center">
                        <h4>
                          {fileSizeConverter(
                            this.state.bookingEquipment.TotalUsage
                          )}
                        </h4>
                        <h6 class="card-title py-0 my-0 font-weight-normal">
                          <span class="text-right">
                            <i class="icon-data_usage"></i> Total
                          </span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row mx-2">
                <div class="col-12 graphContent">
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
                    >
                      <div class="row">
                        <div class="col-12">
                          <div class="row px-0">
                            <div class="col-6 mb-2">
                              <label>Start Time</label>
                              <DatePicker
                                className="w-100"
                                value={this.state.fromDate}
                                name="fromDate"
                                onChange={this.onChange}
                                min={
                                  new Date(
                                    this.state.bookingEquipment.BorrowedDateFrom
                                  )
                                }
                                max={this.state.toDate}
                              />
                            </div>
                            <div class="col-6 mb-2">
                              <label>End Time</label>
                              <DatePicker
                                className="w-100"
                                value={this.state.toDate}
                                name="toDate"
                                onChange={this.onChange}
                                min={this.state.fromDate}
                                max={new Date()}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabStripTab>
                    <TabStripTab
                      title={
                        <label class="p-0 m-0">
                          <i class="icon-clock1"></i> Hourly
                        </label>
                      }
                    >
                      <div class="row">
                        <div class="col-12">
                          <div class="row px-0">
                            <div class="col-12 col-md-4 mb-2">
                              <label>Select a Date</label>
                              <DatePicker
                                className="w-100"
                                value={this.state.selectedDate}
                                name="selectedDate"
                                onChange={this.onChange}
                                max={this.state.toDate}
                                min={this.state.fromDate}
                              />
                            </div>
                            <div class="col-12 col-md-4 mb-2">
                              <label>Start Time</label>
                              <TimePicker
                                className="w-100"
                                steps={this.step}
                                name="fromTime"
                                value={this.state.fromTime}
                                onChange={this.onChange}
                              />
                            </div>
                            <div class="col-12 col-md-4 mb-2">
                              <label>End Time</label>
                              <TimePicker
                                className="w-100"
                                steps={this.step}
                                name="toTime"
                                value={this.state.toTime}
                                onChange={this.onChange}
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
                        <ChartCategoryAxisTitle
                          text={this.state.categoryText}
                        />
                      </ChartCategoryAxisItem>
                    </ChartCategoryAxis>
                    <ChartSeries>
                      <ChartSeriesItem
                        name="Cell Usage"
                        type="column"
                        data={this.state.totalCellUsagePerDays}
                      >
                        <ChartSeriesItemTooltip format="{0} Mb" />
                      </ChartSeriesItem>
                      <ChartSeriesItem
                        name="Other Usage"
                        type="column"
                        data={this.state.totalOtherUsagePerDays}
                      >
                        <ChartSeriesItemTooltip format="{0} Mb" />
                      </ChartSeriesItem>
                      <ChartSeriesItem
                        name="Total Usage"
                        type="column"
                        data={this.state.totalUsagePerDays}
                      >
                        <ChartSeriesItemTooltip format="{0} Mb" />
                      </ChartSeriesItem>
                    </ChartSeries>
                  </Chart>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UserEquipmentUsage);
