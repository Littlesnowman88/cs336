import React from 'react';
import ReactDOM from 'react-dom';
import '../css/base.css';
import CommentBox from './comment_box.js';

ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);
