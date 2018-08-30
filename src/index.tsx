import '../css/style.css';
import '../css/w3-theme-dark-grey.css';
import '../css/w3.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './App';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

ReactDOM.render(
  <App/>,
  root,
);
