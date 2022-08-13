import React, { Component } from "react";
import { connect } from "react-redux";
import GoogleMapReact from "google-map-react";
import {
  ListEquipmentLocations,
  GetGatewayUsage,
  GetSourceUsage,
} from "../../apiService/lookUpAPI";
import { GetBooking } from "../../apiService/bookingAPI";
import MarkerDetailed from "../components/MarkerDetailed";
import { fitBounds } from "google-map-react";
import moment from "moment";

import FmLoadingScreen from "../components/FmLoadingScreen";

import BookingDetailsCard from "../components/screens/BookingDetailsCard";
import GatewayUsageCard from "../components/screens/GatewayUsageCard";

class LocationPage extends Component {
  constructor(props) {
    super(props);
    this.zIndex = 1000;
    this.mapRef = React.createRef();
    this.mapContainer = React.createRef();
    this.state = {
      locations: [],
      center: {
        lat: 59.95,
        lng: 30.33,
      },
      selectedBooking: {},
      equipmentUsage: {},
      isLoading: false,
      selectedEquipmentType: 0,
      showDetailsModal: false,
    };
  }

  computeCenter = (locationsData) => {
    const size = {
      width: this.mapRef.current.clientWidth,
      height: this.mapRef.current.clientHeight,
    };
    let _center = {
      lat:
        locationsData.Locations.length > 0
          ? locationsData.Locations[0].latitude
          : 0,
      lng:
        locationsData.Locations.length > 0
          ? locationsData.Locations[0].longitude
          : 0,
    };
    let _zoom = 10;
    if (locationsData.Locations.length > 1) {
      const { center, zoom } = fitBounds(locationsData.Bounds, size);
      _center = center;
      _zoom = zoom;
    }
    return { center: _center, zoom: _zoom };
  };

  async componentDidMount() {
    this.setState({
      mapWidth: this.mapContainer.current.clientWidth - 30,
      isLoading: true,
    });
    const locationsData = await ListEquipmentLocations();
    if (this.mapRef.current) {
      const zoomCenter = this.computeCenter(locationsData);
      this.setState({
        locationsData,
        locations: locationsData.Locations,
        center: zoomCenter.center,
        zoom: zoomCenter.zoom,
        isLoading: false,
      });
    }
  }

  markerClick = async (l) => {
    this.setState({ isLoading: true });
    const result = await GetBooking(
      l.Equipment.EquipmentId,
      l.Equipment.SalesId
    );
    
    const currentDate = moment(new Date());
    const fromDate = `${moment(l.Equipment.BorrowedDateFrom).format(
      "MM/DD/YYYY"
    )} 00:00:00`;
    const toDate =
      currentDate > moment(l.Equipment.BorrowedDateTo)
        ? `${moment(l.Equipment.BorrowedDateTo).format("MM/DD/YYYY")} 23:59:00`
        : `${currentDate.format("MM/DD/YYYY")} 23:59:00`;
    
    let usageData = {};
    if(l.Equipment.TypeId === 3){
      usageData = await GetGatewayUsage(
        l.Equipment.GatewayId,
        fromDate,
        toDate
      );
    } else if(l.Equipment.TypeId === 1){
      var usageDataResult = await GetSourceUsage(
        l.Equipment.GatewayId,
        fromDate,
        toDate
      );
      usageData.total_usage = usageDataResult.totalUsage;
      usageData.cell_usage = usageDataResult.totalCellUsage;
    }
    

    this.setState({
      isLoading: false,
      selectedBooking: result,
      equipmentUsage: {
        usageData,
        expireIn: 45 - currentDate.diff(fromDate, "days"),
      },
      selectedEquipmentType: l.Equipment.TypeId,
    });
  };

  onZoomClick = ({ lat, lng }, isZoom) => {
    if (!isZoom) {
      this.setState({
        center: {
          lat,
          lng,
        },
        zoom: 18,
      });
    } else {
      const centerzoom = this.computeCenter(this.state.locationsData);
      this.setState({
        center: centerzoom.center,
        zoom: centerzoom.zoom,
      });
    }
  };

  render() {
    return (
      <>
        <FmLoadingScreen isLoading={this.state.isLoading} />
        <div className="row">
          <div
            ref={this.mapContainer}
            className="mapContainer col-12 col-md-12 col-xl-9 col-lg-8 mb-3"
          >
            <div class="card shadow-sm">
              <div class="card-body">
                <h4>Equipment Locations</h4>
                <div class="row">
                  <div
                    className="googlemap col-12"
                    style={{ height: 500 }}
                    ref={this.mapRef}
                  >
                    {this.state.locations.length > 0 ? (
                      <GoogleMapReact
                        class="shadow"
                        onBoundsChange={(e) => {
                          console.log(e);
                        }}
                        bootstrapURLKeys={{
                          key: "AIzaSyABgutERDOABxvVYe0-0mhBvqc2-akKv08",
                        }}
                        defaultZoom={this.state.zoom}
                        defaultCenter={this.state.center}
                        zoom={this.state.zoom}
                        center={this.state.center}
                      >
                        {this.state.locations.map((l) => (
                          <MarkerDetailed
                            lat={l.latitude}
                            lng={l.longitude}
                            equipment={l.Equipment}
                            onClick={async (callback) => {
                              await this.markerClick(l);
                              this.zIndex += 1;
                              callback(this.zIndex);
                            }}
                            onZoomClick={this.onZoomClick}
                          />
                        ))}
                      </GoogleMapReact>
                    ) : (
                      <div class="row">
                        <div class="col-12 text-center">
                          <h1>
                            <i class="icon-files-empty"></i>
                          </h1>
                          <p>
                            Sorry but it seems that no equipment to display
                            right now.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-12 col-xl-3 col-lg-4 px-0">
            {this.state.locations.length > 0 ? (
              <div class="row">
                <BookingDetailsCard
                  selectedBooking={this.state.selectedBooking}
                />
                <GatewayUsageCard
                  equipmentUsage={this.state.equipmentUsage}
                  selectedEquipmentType={this.state.selectedEquipmentType}
                  selectedBooking={this.state.selectedBooking}
                />
              </div>
            ) : null}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LocationPage);
