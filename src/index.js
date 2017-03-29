import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import App from './components/App';
import rootReducer from './reducers'
import './index.css';
import '../node_modules/bootswatch/simplex/bootstrap.min.css'
import '../node_modules/font-awesome/css/font-awesome.min.css'

const loggerMiddleware = createLogger()

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, loggerMiddleware))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);