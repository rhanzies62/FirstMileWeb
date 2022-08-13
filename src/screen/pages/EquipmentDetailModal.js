import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Modal, Row, Table } from "react-bootstrap";
import { Button } from "@progress/kendo-react-buttons";
import { EquipmentDetails } from "./EquipmentDetails";

export class EquipmentDetailModal extends Component {
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
            <Modal.Title>Equipment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <EquipmentDetails
              equipment={this.props.equipment}
              location={this.props.location}
              equipmentHistory={this.props.equipmentHistory}
              onEditButtonClick={this.props.onEditButtonClick}
              onRemoveRestoreEquipment={this.props.onRemoveRestoreEquipment}
              onViewBookingDetails={(history) => {
                this.props.onViewBookingDetails(history);
              }}
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
)(EquipmentDetailModal);
