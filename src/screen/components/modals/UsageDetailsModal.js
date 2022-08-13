import React, { Component } from "react";
import { connect } from "react-redux";
import UsageDetailsCard from "../screens/UsageDetailsCard";
import { Modal } from "react-bootstrap";

export class UsageDetailsModal extends Component {
  render() {
    return (
      <Modal
        show={this.props.displayGraph}
        onHide={this.props.closeModal}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Usage Graph</Modal.Title>
        </Modal.Header>
        <Modal.Body id="usageModal">
          <UsageDetailsCard
            selectedEquipment={this.props.selectedEquipment}
            selectedDate={this.props.selectedDate}
            fromDate={this.props.fromDate}
            fromTime={this.props.fromTime}
            toDate={this.props.toDate}
            toTime={this.props.toTime}
            onChange={this.props.onChange}
          />
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UsageDetailsModal);
