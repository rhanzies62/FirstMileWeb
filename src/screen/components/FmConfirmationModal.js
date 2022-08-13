import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Modal, Row, Table } from "react-bootstrap";
import { Button } from "@progress/kendo-react-buttons";

export class FmConfirmationModal extends Component {
  render() {
    return (
      <div>
        <Modal
          show={this.props.options.show}
          onHide={this.props.options.onHide}
          data-focus="false"
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.props.options.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{this.props.options.message}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                this.props.options.onHide();
                if (this.props.options.onNo) this.props.options.onNo();
              }}
            >
              No
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {
                this.props.options.onHide();
                if (this.props.options.onYes) await this.props.options.onYes();
              }}
            >
              Yes
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
)(FmConfirmationModal);
