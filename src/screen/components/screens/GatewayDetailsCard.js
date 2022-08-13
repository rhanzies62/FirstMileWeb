import React, { Component } from "react";
import { connect } from "react-redux";
import GoogleMapReact from "google-map-react";
import Marker from "../../components/Marker";
import { fileSizeConverter } from "../../../commonService";

class GatewayDetailsCard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { gateway, onViewDetails } = this.props;
    return (
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="row">
            <div class="col-12 mb-2">
              <div class="row" style={{ height: 150 }}>
                <div class="col-12 h-100">
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      key: "AIzaSyABgutERDOABxvVYe0-0mhBvqc2-akKv08",
                    }}
                    defaultZoom={18}
                    defaultCenter={{
                      lat: gateway.Latitude,
                      lng: gateway.Longitude,
                    }}
                  >
                    <Marker
                      lat={gateway.Latitude}
                      lng={gateway.Longitude}
                      color={"red"}
                    />
                  </GoogleMapReact>
                </div>
              </div>
            </div>
          </div>

          <h5 class="card-title py-0 my-0">
            <i class="icon-tools"></i> {gateway.Name}
          </h5>

          <div class="row mt-2">
            <div class="col-4 text-center">
              <h5>{fileSizeConverter(gateway.TotalCellUsage)}</h5>
              <h6>
                <i class="icon-phone4"></i> Cell
              </h6>
            </div>
            <div class="col-4 text-center">
              <h5>{fileSizeConverter(gateway.OtherUsage)}</h5>
              <h6>
                <i class="icon-devices_other"></i> Other
              </h6>
            </div>
            <div class="col-4 text-center">
              <h5>{fileSizeConverter(gateway.TotalUsage)}</h5>
              <h6>
                <i class="icon-data_usage"></i> Total
              </h6>
            </div>
          </div>
          <button
            class="btn btn-primary btn-sm float-right mt-3"
            onClick={onViewDetails}
          >
            View Details <i class="icon-go mt-1"></i>
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GatewayDetailsCard);
