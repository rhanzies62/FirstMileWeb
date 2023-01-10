import moment from "moment";
import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import {
  AddEquipmentNote,
  ListBookingEquipmentNote,
} from "../../apiService/bookingAPI";

class BookingEquipmentNotesModal extends Component {
  defaultNote = {
    EquipmentNoteId: 0,
    Notes: "",
    EquipmentId: this.props.equipmentId,
    BookingEquipmentId: this.props.saleEquipmentId,
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      notes: [],
      note: this.defaultNote,
    };
  }

  async componentDidMount() {
    var result = await ListBookingEquipmentNote(
      this.props.equipmentId,
      this.props.saleEquipmentId
    );
    this.setState({
      notes: result,
    });
  }

  subimtNote = async () => {
    this.setState({ isLoading: true });
    await AddEquipmentNote(this.state.note);
    var result = await ListBookingEquipmentNote(
      this.props.equipmentId,
      this.props.saleEquipmentId
    );
    this.setState({
      notes: result,
      isLoading: false,
      note: this.defaultNote,
    });
  };

  render() {
    return (
      <>
        <Modal
          show={this.props.show}
          onHide={this.props.onHide}
          data-focus="false"
          backdrop="static"
          keyboard={false}
          size="xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>Equipment Notes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="row">
              <div class="col-12 col-lg-4">
                {this.state.notes.length > 0 ? (
                  this.state.notes.map((note) => (
                    <div
                      class="card mb-2 noteCard"
                      onClick={() => {
                        this.setState({
                          note: note,
                        });
                      }}
                    >
                      <div class="card-body p-2">
                        <div class="d-flex justify-content-between">
                          <small class="m-0 p-0">
                            {note.CreatedByUsername}
                          </small>
                          <small class="m-0 p-0">
                            {moment(note.CreatedDate).format("MM/DD/YYYY")}
                          </small>
                        </div>
                        <hr class="my-2 p-0" />
                        <div class="row">
                            <div class="col-12 text-truncate">{note.Notes}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div class="card">
                    <div class="card-body p-2 d-flex justify-content-center align-items-center">
                      <label class="m-0 p-0">No Notes Added Yet.</label>
                    </div>
                  </div>
                )}
              </div>
              <div class="col-12 col-lg-8">
                <div class="card">
                  <div class="card-body p-2">
                    <textarea
                      value={this.state.note.Notes}
                      class="form-control"
                      placeholder="Add your notes here"
                      style={{ resize: "none" }}
                      rows="8"
                      onChange={(e) => {
                        this.setState({
                          note: { ...this.state.note, Notes: e.target.value },
                        });
                      }}
                      disabled={this.state.isLoading}
                    ></textarea>
                    {this.state.note.EquipmentNoteId !== 0 ? (
                      <button
                        class="btn btn-sm btn-danger float-right mt-2"
                        disabled={this.state.isLoading}
                        onClick={() => {
                          this.setState({ note: this.defaultNote });
                        }}
                      >
                        Cancel
                      </button>
                    ) : null}
                    <button
                      class="btn btn-sm btn-success float-right mt-2 mr-2"
                      disabled={this.state.isLoading}
                      onClick={this.subimtNote}
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.onHide}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookingEquipmentNotesModal);
