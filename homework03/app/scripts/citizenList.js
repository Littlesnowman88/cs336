import React from 'react';
import Citizen from './citizen.js';

module.exports = React.createClass({
  render: function() {
    var citizenNodes = this.props.data.map(function(citizen) {
      return (
        <Citizen key={citizen.loginID}>
          {citizen}
        </Citizen>
      );
    });
    return (
      <div className="citizenList">
        {citizenNodes}
      </div>
    );
  }
});
