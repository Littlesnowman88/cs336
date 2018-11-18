import React from 'react';

module.exports = React.createClass({
  getInitialState: function() {
    return {loginID: '', firstName: '', lastName: '', startDate: ''};
  },
  handleLoginIDChange: function(e) {
    this.setState({loginID: e.target.value});
  },
  handleFirstNameChange: function(e) {
    this.setState({firstName: e.target.value});
  },
  handleLastNameChange: function(e) {
    this.setState({lastName: e.target.value});
  },
  handleStartDateChange: function(e) {
    this.setState({startDate: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var loginID = this.state.loginID.trim();
    var firstName = this.state.firstName.trim();
    var lastName = this.state.lastName.trim();
    var startDate = this.state.startDate.trim();
    if (!loginID || !firstName || !lastName || !startDate) {
      return;
    }
    this.props.onCitizenSubmit({loginID: {firstName: firstName, lastName: lastName, startDate: startDate}});
    this.setState(this.getInitialState());
  },
  render: function() {
    return (
      <form className="addPerson" onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Login ID"
            value={this.state.loginID}
            onChange={this.handleLoginIDChange}
          />
          <input
            type="text"
            placeholder="First Name"
            value={this.state.firstName}
            onChange={this.handleFirstNameChange}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={this.state.lastName}
            onChange={this.handleLastNameChange}
          />
          <input
            type="text"
            placeholder="Start Date (mm/dd/yyyy)"
            value={this.state.startDate}
            onChange={this.handleStartDateChange}
          />
          <input type="submit" value="Submit"/>
      </form>
    );
  } //<em id="resultText">
});
