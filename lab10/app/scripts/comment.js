import React from 'react';
import Remarkable from 'remarkable';

module.exports = React.createClass({
  //best practice warns not to use this, but the tutorial says to do this anyway
  rawMarkup: function() {
    var md = new Remarkable();
    //FIXME: PROBLEM: bundle doesn't recognize "this", so browser throws an error.
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});
