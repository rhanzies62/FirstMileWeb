import * as React from "react";

import { Calendar } from "@progress/kendo-react-dateinputs";

export class CustomCalendar extends React.Component {
  render() {
    return (
      <Calendar
        bottomView="year"
        topView="year"
        value={this.props.value}
        onChange={this.props.onChange}
      />
    );
  }
}
