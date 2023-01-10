import React, { Component } from "react";
import { connect } from "react-redux";
import { GetBookingBySalesId } from "../../apiService/bookingAPI";
import { GetGatewayUsage, GetSourceUsage } from "../../apiService/lookUpAPI";
import moment from "moment";
import { fileSizeConverter } from "../../commonService";
import FmLoadingScreen from "../components/FmLoadingScreen";
import { DatePicker, DateRangePicker } from "@progress/kendo-react-dateinputs";

class BookingDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingDetails: {},
      isLoading: false,
    };
  }

  async componentDidMount() {
    if (this.props.salesId) {
      await this.loadBookingDetails();
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.salesId !== this.props.salesId) {
      await this.loadBookingDetails();
    }
  }

  loadBookingDetails = async () => {
    this.setState({ isLoading: true });
    const bookingDetails = await GetBookingBySalesId(this.props.salesId);
    for (let i = 0; i <= bookingDetails.BookEquipments.length - 1; i++) {
      const {
        Equipment,
        ServiceTypeId,
        BorrowedDateFrom,
        BorrowedDateTo,
      } = bookingDetails.BookEquipments[i];
      if (ServiceTypeId === 1 && (Equipment.TypeId === 3 || Equipment.TypeId === 1)) {
        const to = moment(BorrowedDateTo) > moment(new Date()) ? `${moment(new Date()).format("MM/DD/YYYY")} 23:59:59` : `${moment(BorrowedDateTo).format("MM/DD/YYYY")} 23:59:59`;
        if(Equipment.TypeId === 3){
          const usage = await GetGatewayUsage(Equipment.GatewayId,`${moment(BorrowedDateFrom).format("MM/DD/YYYY")} 00:00:00`,to);
          bookingDetails.BookEquipments[i].TotalUsage = usage.total_usage;
          bookingDetails.BookEquipments[i].CellUsage = usage.cell_usage;
          bookingDetails.BookEquipments[i].OtherUsage = usage.total_usage - usage.cell_usage;
        } else if (Equipment.TypeId == 1){
          const usage = await GetSourceUsage(Equipment.GatewayId,`${moment(BorrowedDateFrom).format("MM/DD/YYYY")} 00:00:00`,to);
          bookingDetails.BookEquipments[i].TotalUsage = usage.totalUsage;
          bookingDetails.BookEquipments[i].CellUsage = usage.totalCellUsage;
          bookingDetails.BookEquipments[i].OtherUsage = usage.totalUsage - usage.totalCellUsage;          
        }

      }
      if (Equipment.EquipmentId === this.props.selectedEquipmentId) {
        bookingDetails.BookEquipments[i].isSelected = true;
      }
    }
    this.setState({ bookingDetails, isLoading: false });
  };

  render() {
    return (
      <>
        <FmLoadingScreen isLoading={this.state.isLoading} />
        <div class="row">
          <div clas="col-xl-12 col-5">
            <div class="card">
              <div class="card-body">
                {this.state.bookingDetails.SalesId ? (
                  <>
                    <div class="row pb-1 border-bottom">
                      <div class="col-6 col-lg-8">
                        <p class="card-title m-0 font-weight-bold">
                          <i class="icon-info"></i> ID:{" "}
                          {this.state.bookingDetails.SalesId}
                        </p>
                        <div class="row">
                          <div class="col-12 smaller">
                            <label class="text-muted font-weight-bold mb-0">
                              Created At:{" "}
                            </label>{" "}
                            {moment(
                              this.state.bookingDetails.CreatedDate
                            ).format("DD/MM/YYYY")}
                            , <strong>By</strong>{" "}
                            {this.state.bookingDetails.CreatedByUserName}
                          </div>
                        </div>
                      </div>
                      {this.props.displayEditButton ? (
                        <>
                          <div class="col-6 col-lg-4 text-right">
                            <h5 class="card-title">
                              <button
                                class="btn btn-success"
                                onClick={() => {
                                  if (this.props.onEditCallBack)
                                    this.props.onEditCallBack();
                                }}
                              >
                                <i class="icon-edit-pencil"></i>
                              </button>
                              <button
                                class="btn btn-danger ml-2"
                                onClick={() => {
                                  if (this.props.onRemoveCallBack)
                                    this.props.onRemoveCallBack();
                                }}
                              >
                                <i class="icon-trashcan1"></i>
                              </button>
                            </h5>
                          </div>
                        </>
                      ) : null}
                    </div>
                    <div class="row mt-2">
                      <div class="col-12">
                        <p class="card-title m-0 font-weight-bold">
                          <i class="icon-film2"></i>{" "}
                          {this.state.bookingDetails.ProjectName}
                        </p>
                      </div>
                      <div class="col-12">
                        <p class="card-title m-0">
                          <i class="icon-people_alt"></i>{" "}
                          {this.state.bookingDetails.CustomerName}
                        </p>
                      </div>
                      <div class="col-12">
                        <p class="card-title m-0">
                          <i class="icon-addressbook"></i>{" "}
                          {this.state.bookingDetails.Status}
                        </p>
                      </div>

                      {this.state.bookingDetails.ShippingInfo ? (
                        <div class="col-12">
                          <p class="card-title m-0">
                            <i class="icon-shipping"></i>{" "}
                            {this.state.bookingDetails.ShippingInfo}
                          </p>
                        </div>
                      ) : null}

                      {this.state.bookingDetails.DropOffDate ? (
                        <div class="col-12">
                          <p class="card-title m-0">
                            <i class="icon-calendar-alt-stroke"></i>{" "}
                            {moment(
                              this.state.bookingDetails.DropOffDate
                            ).format("DD MMM, YYYY")}
                          </p>
                        </div>
                      ) : null}

                      {this.state.bookingDetails.Comment ? (
                        <div class="col-12">
                          <p class="card-title m-0">
                            <i class="icon-comment-alt2-fill"></i>{" "}
                            {this.state.bookingDetails.Comment}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <div class="card-body">
                    <div class="row">
                      <div class="col-12 text-center">
                        <h1>
                          <i class="icon-files-empty"></i>
                        </h1>
                        <p>Please select an booking to view the details.</p>
                      </div>
                    </div>
                  </div>
                )}{" "}
              </div>
            </div>
          </div>
          {this.state.bookingDetails.SalesId ? (
            <div class="col-xl-12">
              <div class="card mt-2">
                <div class="card-body">
                  <div class="row pb-1 border-bottom">
                    <div class="col-12">
                      <p class="card-title m-0 font-weight-bold">
                        <i class="icon-info"></i> Equipments
                      </p>
                    </div>
                  </div>

                  <div
                    class="row"
                    style={{
                      maxHeight: 500,
                      overflow: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    {this.state.bookingDetails.BookEquipments.map((be) => (
                      <div class="col-xxl-12 col-xl-12 col-md-6 col-12 col-12 px-0 px-md-2">
                        <div
                          class={`px-0 my-2 p-2 shadow-sm ${
                            be.isSelected ? "selected" : "border"
                          }`}
                        >
                          <div class="row px-md-3">
                            <div class="col-11">
                              <p class="card-title m-0 font-weight-bold">
                                <i class="icon-tools"></i>{" "}
                                {be.Equipment.Name || be.ServiceType}
                              </p>
                            </div>
                            {this.props.displayEditButton ? (
                              <div class="col-1">
                                <button
                                  type="button"
                                  class="close"
                                  aria-label="Close"
                                  onClick={() => {
                                    this.props.onRemoveEquipmentCallBack(
                                      be.SaleEquipmentId
                                    );
                                  }}
                                >
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                            ) : null}
                          </div>
                          {be.Equipment.Type ? (
                            <>
                              <div class="col-12">
                                <p class="card-title m-0">
                                  <i class="icon-equalizer"></i>{" "}
                                  {be.Equipment.Type}
                                </p>
                              </div>
                            </>
                          ) : null}

                          {be.Equipment.Serial ? (
                            <>
                              <div class="col-12">
                                <p class="card-title m-0">
                                  <i class="icon-barcode"></i>{" "}
                                  {be.Equipment.Serial}
                                </p>
                              </div>
                            </>
                          ) : null}

                          <div class="col-12">
                            <p class="card-title m-0 text-muted">
                              <i class="icon-calendar"></i>{" "}
                              {moment(be.BorrowedDateFrom).format(
                                "MMM DD, YYYY"
                              )}{" "}
                              -{" "}
                              {moment(be.BorrowedDateTo).format("MMM DD, YYYY")}
                            </p>
                          </div>

                          {be.Equipment.Name && (be.Equipment.TypeId === 3 || be.Equipment.TypeId === 1) ? (
                            <>
                              <div class="col-12">
                                <p class="card-title m-0 font-weight-bold">
                                  Usage Details
                                </p>
                              </div>
                              <div class="mt-2 col-12">
                                <div class="row">
                                  <div class="col-6 col-md-6 col-lg-4 text-center mb-2">
                                    <p class="card-title m-0 font-weight-bold">
                                      {fileSizeConverter(be.CellUsage)}
                                    </p>
                                    <p class="card-title m-0 font-weight-bold">
                                      <i class="icon-phone4"></i>
                                    </p>
                                  </div>
                                  <div class="col-6 col-md-6 col-lg-4 text-center">
                                    <p class="card-title m-0 font-weight-bold">
                                      {fileSizeConverter(be.OtherUsage)}
                                    </p>
                                    <p class="card-title m-0 font-weight-bold">
                                      <i class="icon-devices_other"></i>
                                    </p>
                                  </div>
                                  <div class="col-12 col-md-12 col-lg-4 text-center">
                                    <p class="card-title m-0 font-weight-bold">
                                      {fileSizeConverter(be.TotalUsage)}
                                    </p>
                                    <p class="card-title m-0 font-weight-bold">
                                      <i class="icon-data_usage"></i>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : null}
                            <div class="col-12">
                              <hr/>
                            </div>

                            <div class="col-12 d-flex justify-content-end">
                              <button class="btn btn-primary btn-sm" onClick={()=>{
                                this.props.onOpenNotes(be);
                              }}>Notes ({be.NoteCount})</button>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(BookingDetails);
