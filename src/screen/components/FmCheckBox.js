import React, { Component } from "react";
import { Form } from "react-bootstrap";

export default class FmCheckBox extends Component {
  render() {
    return (
      <Form.Group controlId={this.props.id}>
        <Form.Check type="checkbox" label={this.props.label} />
      </Form.Group>
    );
  }
}
