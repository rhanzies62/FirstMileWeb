import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Modal, Row, Table } from "react-bootstrap";
import { Button } from "@progress/kendo-react-buttons";
import { CustomerDetail } from "./CustomerDetail";

export class CustomerDetailModal extends Component {
  render() {
    return (
      <div>
        <Modal
          show={this.props.show}
          onHide={this.props.onHide}
          data-focus="false"
          backdrop="static"
          keyboard={false}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Customer Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CustomerDetail
              selectedCustomer={this.props.selectedCustomer}
              displayEditButton={this.props.displayEditButton || false}
              onEditCallBack={this.props.onEditCallBack}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.onHide}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerDetailModal);
