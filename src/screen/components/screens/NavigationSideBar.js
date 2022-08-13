import React, { Component } from "react";
import { connect } from "react-redux";
import FmResponsiveSize from "../../components/fmResponsiveSize";
import { HashRouter, NavLink, Redirect, Route, Switch } from "react-router-dom";
import EquipmentUsageDownloader from "../../pages/EquipmentUsageDownloader";

class NavigationSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      userType: 1,
      sideBarClass: "",
    };
  }

  toggleSidebar = () => {
    this.setState({
      sideBarClass: this.state.sideBarClass === "toggled" ? "" : "toggled",
    });
  };

  render() {
    return (
      <div class={this.state.sideBarClass + " d-flex"} id="wrapper">
        <div class="bg-light border-right" id="sidebar-wrapper">
          <div class="sidebar-heading">FirstMile </div>
          <div class="list-group list-group-flush">
            {this.props.menus
              ? this.props.menus.map((menu) => (
                  <NavLink
                    onClick={this.toggleSidebar}
                    to={menu.Link}
                    exact
                    className="list-group-item list-group-item-action bg-light"
                  >
                    <span class={`k-icon ${menu.Icon}`}></span> {menu.Label}
                  </NavLink>
                ))
              : null}
          </div>
        </div>
        <div id="page-content-wrapper">
          <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <button class="btn" type="button" onClick={this.toggleSidebar}>
              <span class="navbar-toggler-icon"></span>
            </button>
            <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
              <li class="nav-item dropdown">
                <NavLink to="/logout" exact className="nav-link">
                  <span
                    class="k-icon icon-logout"
                    style={{
                      marginTop: -6,
                    }}
                  ></span>{" "}
                  Logout
                </NavLink>
              </li>
            </ul>
          </nav>
          <div className="container-fluid mt-3 no-padding-x-xs px-sm-5 mb-5">
            <FmResponsiveSize />
            <Switch>
              {this.props.routes.map((route) => (
                <Route exact={route.Exact} path={route.Path} component={route.Component} />
              ))}
              <Route exact={false} path="/equipmentusage" component={EquipmentUsageDownloader} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    menus: state.auth.menus,
    routes: state.auth.routes,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationSideBar);
