import React from 'react';
import CitizenList from './citizenList.js';
import CitizenForm from './citizenForm.js';
import $ from 'jquery';

module.exports = React.createClass({
  loadCitizensFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCitizenSubmit: function(citizen) {
    var citizens = this.state.data;
    var newCitizens = citizens.concat([citizen]);
    this.setState({data: newCitizens});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: citizen,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: citizen});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
   this.loadCitizensFromServer();
   setInterval(this.loadCitizensFromServer, this.props.pollInterval);
 },
  render: function() {
    return (
      <div className="citizenBox">
        <h1>Remnant Citizens</h1>
        <CitizenList data={this.state.data} />
        <CitizenForm onCitizenSubmit={this.handleCitizenSubmit}/>
      </div>
    );
  }
});
