import * as React from "react";
import {
  GridColumnMenuFilter,
  GridColumnMenuCheckboxFilter,
} from "@progress/kendo-react-grid";

export class ColumnMenu extends React.Component {
  render() {
    return (
      <div>
        <GridColumnMenuFilter {...this.props} expanded={true} />
      </div>
    );
  }
}

export class ColumnMenuCheckboxFilter extends React.Component {
  render() {
    return (
      <div>
        <GridColumnMenuCheckboxFilter
          {...this.props}
          expanded={true}
        />
      </div>
    );
  }
}
