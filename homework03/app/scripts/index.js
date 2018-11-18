import React from 'react';
import ReactDOM from 'react-dom';
import '../css/base.css';
import CitizenBox from './citizenBox.js';

ReactDOM.render(
  <CitizenBox url="/people" pollInterval={2000} />,
  document.getElementById('content')
);
