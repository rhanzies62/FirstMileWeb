import React, { Component } from "react";
import { connect } from "react-redux";

class MarkerDetailed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zIndex: 1000,
      isZoom: true,
    };
    console.log(this.props.equipment);
  }
  render() {
    return (
      <div
        class="markerDetailed shadow-sm"
        alt={this.props.text}
        style={{
          zIndex: this.state.zIndex,
          borderColor: this.props.equipment.Color,
        }}
        onClick={() => {
          this.props.onClick((zIndex) => {
            this.setState({ zIndex: zIndex });
          });
        }}
      >
        <div class="row">
          <div class="col-12 m-2">
            <label
              class="font-weight-bold my-0 py-0"
              style={{ color: this.props.equipment.Color }}
            >
              <i class="icon-film2"></i>{" "}
              {this.props.equipment.Name.toUpperCase()}
            </label>
            <label class="my-0 py-0">
              <i class="icon-tools"></i>{" "}
              {this.props.equipment.ProjectName.toUpperCase()}
            </label>
            <label class="my-0 py-0">
              <i class="icon-calendar"></i>{" "}
              {this.props.equipment.BorrowedDateFrom} -{" "}
              {this.props.equipment.BorrowedDateTo}
            </label>
            <div class="col-12">
              <button
                class="btn btn-primary btn-sm float-right"
                onClick={() => {
                  this.setState({ isZoom: !this.state.isZoom }, () => {
                    this.props.onZoomClick(this.props, this.state.isZoom);
                  });
                }}
              >
                <i
                  class={`${
                    this.state.isZoom ? "icon-zoomin" : "icon-zoomout"
                  }`}
                ></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MarkerDetailed);

