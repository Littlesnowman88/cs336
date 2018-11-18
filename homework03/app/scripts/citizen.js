import React from 'react';
import Remarkable from 'remarkable';

module.exports = React.createClass({
  /**
   * return the number of years between startingDate and today
   * takes individual months into account.
   * Params: startingDate: the date a person started with the organization
   * Returns: seniority, the number of years; else, -1 because startingDate is after today.
   */
  getSeniority: function(startingDate) {
    let todayDate = new Date();
    let startDate = new Date(startingDate);
    var seniority = todayDate.getFullYear() - startDate.getFullYear();
    let month_difference = todayDate.getMonth() - startDate.getMonth();
    // if today is before the person's employment anniversary (excluding the year)
    if (month_difference < 0 || (month_difference === 0 && todayDate.getDate() < startDate.getDate())) {
     seniority--;
    }
    if (seniority >= 0) {return seniority;}
    else {return "???";}
  },

  render: function() {
    let individualCitizen = this.props.children;
    return (
      <div className="citizen">
        <h2 className="citizenName">
          {individualCitizen.firstName + " " + individualCitizen.lastName}
        </h2>
        <h3 className="citizenYears">
          Seniority (years of combat experience): {this.getSeniority(individualCitizen.startDate)}
        </h3>
      </div>
    );
  }
});
