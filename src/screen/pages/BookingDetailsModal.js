import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Modal, Row, Table } from "react-bootstrap";
import BookingDetails from "./BookingDetails";
import { Button } from "@progress/kendo-react-buttons";

class BookingDetailsModal extends Component {
  render() {
    return (
      <>
        <Modal
          show={this.props.show}
          onHide={this.props.onHide}
          data-focus="false"
          backdrop="static"
          keyboard={false}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Booking Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BookingDetails
              selectedEquipmentId={this.props.selectedEquipmentId}
              salesId={this.props.salesId}
              displayEditButton={this.props.displayEditButton || false}
              onEditCallBack={this.props.onEditCallBack}
              onRemoveCallBack={this.props.onRemoveCallBack}
              onRemoveEquipmentCallBack={this.props.onRemoveEquipmentCallBack}
            />
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
)(BookingDetailsModal);
