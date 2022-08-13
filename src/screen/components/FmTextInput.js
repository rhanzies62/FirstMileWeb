import React, { Component } from "react";
import { Form } from "react-bootstrap";

export default class FmTextInput extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Form.Group controlId={this.props.id}>
        <Form.Label>{this.props.label}</Form.Label>
        <Form.Control
          type={this.props.type}
          placeholder={this.props.placeholder}
          onChange={this.props.onChange}
          name={this.props.name}
        />
        <Form.Text className="text-muted"></Form.Text>
      </Form.Group>
    );
  }
}
