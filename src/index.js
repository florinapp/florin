import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createHashHistory'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import App from './components/App';
import rootReducer from './reducers'
import './index.css';
import '../node_modules/bootswatch/simplex/bootstrap.min.css'
import '../node_modules/font-awesome/css/font-awesome.min.css'

const history = createHistory()

const loggerMiddleware = createLogger()

const store = createStore(rootReducer,
                          applyMiddleware(thunkMiddleware, loggerMiddleware, routerMiddleware(history)))

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('root')
);