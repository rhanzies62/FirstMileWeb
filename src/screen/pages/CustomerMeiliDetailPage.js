import React, { Component } from "react";
import { connect } from "react-redux";
import { GetMeili } from "../../apiService/userAPI";

export class CustomerMeiliDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meili: null,
    };
  }

  async componentDidMount() {
    var result = await GetMeili(this.props.match.params.id);
    this.setState({
      meili: result,
    });
  }

  render() {
    return (
      <>
        {this.state.meili ? (
          <div class="container">
            <div class="row">
              <div class="col-12">
                <h4>Meili Job: {this.state.meili.ProjectName}</h4>
              </div>
              <div class="col-12 col-lg-8">
                <div class="card mb-3">
                  <div class="card-header">
                    <strong>Latest Transfer</strong>
                  </div>
                  <div class="card-body"></div>
                </div>
              </div>
              <div class="col-12 col-lg-4">
                <div class="card mb-3">
                  <div class="card-header">
                    <strong>Status</strong>
                  </div>
                  <div class="card-body"></div>
                </div>
                <div class="card">
                  <div class="card-header">
                    <strong>State</strong>
                  </div>
                  <div class="card-body"></div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerMeiliDetailPage);
