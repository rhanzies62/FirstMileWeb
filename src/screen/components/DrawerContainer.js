import * as React from "react";
import { withRouter } from "react-router-dom";
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
  Avatar,
  Drawer,
  DrawerContent,
} from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { BadgeContainer } from "@progress/kendo-react-indicators";
import { Badge } from "react-bootstrap";

const admin = [
  { text: "Home", selected: true, route: "/", icon: "k-i-inbox" },
  { text: "Equipments", route: "/equipments", icon: "k-i-gear" },
  { text: "Booking", route: "/booking", icon: "k-i-calendar" },
  { text: "Customer", route: "/customer", icon: "icon-user2" },
  { text: "User", route: "/user", icon: "icon-locked" },
  { text: "About", route: "/about", icon: "k-i-information" },
  { text: "Logout", route: "/logout", icon: "icon-logout" },
];

const user = [
  { text: "Home", selected: true, route: "/", icon: "k-i-inbox" },
  { text: "Logout", route: "/logout", icon: "icon-logout" },
];
let kendokaAvatar =
  "https://www.telerik.com/kendo-react-ui-develop/images/kendoka-react.png";
class DrawerContainer extends React.Component {
  constructor(props) {
    super(props);
    console.log("this.props.userType", this.props.userType);
    this.items = this.props.userType
      ? this.props.userType === "1"
        ? admin
        : user
      : [];
    this.state = {
      expanded: true,
      selectedId: this.items.findIndex((x) => x.selected === true),
    };
  }

  handleClick = () => {
    this.setState((e) => ({ expanded: !e.expanded }));
  };

  onSelect = (e) => {
    this.setState({ selectedId: e.itemIndex });
    this.props.history.push(e.itemTarget.props.route);
  };

  setSelectedItem = (pathName) => {
    let currentPath = this.items.find((item) => item.route === pathName);
    if (currentPath) {
      if (currentPath.text) {
        return currentPath.text;
      }
    }
    return "";
  };

  drawerProps = {
    position: "start",
    mode: "push",
  };

  render() {
    let selected = this.setSelectedItem(this.props.location.pathname);
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
            <h1 className="title">FirstMile</h1>
          </AppBarSection>

          <AppBarSpacer style={{ width: 32 }} />

          <AppBarSection></AppBarSection>

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
        <Drawer
          expanded={this.state.expanded}
          items={this.items.map((item) => ({
            ...item,
            selected: item.text === selected,
          }))}
          {...this.drawerProps}
          onSelect={this.onSelect}
        >
          <DrawerContent>
            <div
              className="container-fluid"
              style={{
                height: window.innerHeight - 70,
                overflow: "auto",
              }}
            >
              {this.props.children}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }
}

export default withRouter(DrawerContainer);
