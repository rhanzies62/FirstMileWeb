import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import BookingDetailsModal from "../../pages/BookingDetailsModal";

class BookingDetailsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetailsModal: false,
    };
  }
  render() {
    const { selectedBooking } = this.props;
    return (
      <>
        <div class="col-12 col-md-6 col-lg-12 mx-0">
          <div class="shadow-sm card mb-3">
            <div class="card-body">
              <p class="card-title pb-1 px-3 border-bottom font-weight-bold">
                <i class="icon-notebook"></i> Booking Details
              </p>
              {selectedBooking.Booking ? (
                <div class="col-12 border-bottom user-select-none bookingItem">
                  <div class="row">
                    <div class="col-12">
                      <h6 class="py-0 my-0">
                        <i class="icon-film2"></i>{" "}
                        {selectedBooking.Booking.ProjectName}
                      </h6>
                      <label class="py-0 my-0 w-100">
                        <i class="icon-people_alt"></i>{" "}
                        {selectedBooking.Booking.Customer.Name}
                      </label>
                      <label class="py-0 my-0 w-100">
                        <i class="icon-addressbook"></i>{" "}
                        {selectedBooking.Booking.Status}
                      </label>
                      <label class="py-0 my-0 w-100">
                        <i class="icon-calendar"></i>{" "}
                        {moment(selectedBooking.BorrowedDateFrom).format(
                          "MM/DD/YYYY"
                        )}{" "}
                        -{" "}
                        {moment(selectedBooking.BorrowedDateTo).format(
                          "MM/DD/YYYY"
                        )}
                      </label>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 my-2">
                      <button
                        class="btn btn-primary btn-sm float-right"
                        onClick={() => {
                          this.setState({ showDetailsModal: true });
                        }}
                      >
                        <i class="icon-magnifying-glass"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div class="row">
                  <div class="col-12 text-center">
                    <label class="text-muted">
                      Choose an equipment to view the booking details
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {selectedBooking.SaleId && this.state.showDetailsModal ? (
          <BookingDetailsModal
            salesId={selectedBooking.SaleId}
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BookingDetailsCard);
