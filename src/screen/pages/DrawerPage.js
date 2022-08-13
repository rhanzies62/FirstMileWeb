import React, { Component } from "react";
import {
  Accordion,
  Button,
  Card,
  Col,
  Form,
  FormControl,
  Nav,
  Navbar,
  NavDropdown,
  Row,
} from "react-bootstrap";
import { connect } from "react-redux";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import * as authActions from "../../action/authAction";
import DashboardPage from "./DashboardPage";
import EquipmentPage from "./EquipmentPage";
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
  Avatar,
  Drawer,
  DrawerContent,
} from "@progress/kendo-react-layout";
import { Badge, BadgeContainer } from "@progress/kendo-react-indicators";
import DrawerRouterContainer from "../components/DrawerContainer";

let kendokaAvatar =
  "https://www.telerik.com/kendo-react-ui-develop/images/kendoka-react.png";
class DrawerPage extends Component {
  constructor(props) {
    super(props);
    this.items = [
      {
        text: "Dashboard",
        icon: "k-i-inbox",
        selected: true,
        route: "/dashboard",
      },
      { separator: true },
      { text: "Equipments", icon: "k-i-bell", route: "/equipments" },
      { text: "Calendar", icon: "k-i-calendar" },
      { separator: true },
      { text: "Attachments", icon: "k-i-hyperlink-email" },
      { text: "Favourites", icon: "k-i-star-outline" },
    ];

    this.state = {
      expanded: true,
      selectedId: this.items.findIndex((x) => x.selected === true),
    };
  }

  handleClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  handleSelect = (ev) => {
    this.setState({ selectedId: ev.itemindex, expanded: false });
    this.props.history.push(ev.itemTarget.props.route);
  };

  render() {
    const logo = require("../../img/logo.png");
    return (
      <div>
        <AppBar>
          <AppBarSection>
            <button
              className="k-button k-button-clear"
              onClick={this.handleClick}
            >
              <span className="k-icon k-i-menu" />
            </button>
          </AppBarSection>

          <AppBarSpacer style={{ width: 4 }} />

          <AppBarSection>
            <h1 className="title">KendoReact</h1>
          </AppBarSection>

          <AppBarSpacer style={{ width: 32 }} />

          <AppBarSection>
            <ul>
              <li>
                <span>What's New</span>
              </li>
              <li>
                <span>About</span>
              </li>
              <li>
                <span>Contacts</span>
              </li>
            </ul>
          </AppBarSection>

          <AppBarSpacer />

          <AppBarSection className="actions">
            <button className="k-button k-button-clear">
              <BadgeContainer>
                <span className="k-icon k-i-bell" />
                <Badge
                  shape="dot"
                  themeColor="info"
                  size="small"
                  position="inside"
                />
              </BadgeContainer>
            </button>
          </AppBarSection>

          <AppBarSection>
            <span className="k-appbar-separator" />
          </AppBarSection>

          <AppBarSection>
            <Avatar shape="circle" type="image">
              <img src={kendokaAvatar} />
            </Avatar>
          </AppBarSection>
        </AppBar>
        <style>{`
                body {
                    background: #dfdfdf;
                }
                .title {
                    font-size: 18px;
                    margin: 0;
                }
                .k-button {
                    padding: 0;
                }
                .k-badge-container {
                    margin-right: 8px;
                }
            `}</style>

        <Drawer
          expanded={this.state.expanded}
          position="start"
          mode="overlay"
          animation={{ duration: 400 }}
          items={this.items.map((item, index) => ({
            ...item,
            selected: index === this.state.selectedId,
          }))}
          onOverlayClick={this.handleClick}
          onSelect={this.handleSelect}
        >
          <DrawerContent>
            <DrawerContent>{this.props.children}</DrawerContent>
          </DrawerContent>
        </Drawer>
        <style>
          {`my-app {
                    padding: 0;
                }
                .k-drawer-content { padding: 20px; }
                .k-drawer-container {
                    position: fixed;
                    width: 100%;
                    height: 100%;
                }
                .k-drawer-item {
                    user-select: none;
                }`}
        </style>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: {
      updateAuth: bindActionCreators(
        authActions.updateAuthentication,
        dispatch
      ),
    },
  };
}

export default withRouter(DrawerRouterContainer);
