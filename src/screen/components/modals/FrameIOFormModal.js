import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import * as userApiService from "../../../apiService/userAPI";

class FrameIOFormModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frameIOToken: "",
    };
  }
  saveToken = async () => {
    await userApiService.updateUserFrameIOToken(this.state.frameIOToken);
    this.props.closeModal();
  };

  setFrameIOToken = (e) => {
    this.setState({
      frameIOToken: e.target.value,
    });
  };

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.closeModal}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Frame.io Token</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="row">
            <div class="col-12">
              <div class="form-group">
                <label>Please Enter your Frame.io Token</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Frame.io Token"
                  onBlur={this.setFrameIOToken}
                />
                <label>
                  Click{" "}
                  <a href="https://developer.frame.io/" target="_blank">
                    here
                  </a>{" "}
                  to login your frame.io account and generate your token
                </label>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <hr />
              <button class="btn btn-success float-right" onClick={this.saveToken}>Save Changes</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(FrameIOFormModal);
