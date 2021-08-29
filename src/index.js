import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import './styles/main.scss';
import BigTwo from './BigTwo';
import * as serviceWorker from './serviceWorker';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import gameReducer, { socketIoMiddleware } from './store/reducers/game';
import { BrowserRouter as Router } from 'react-router-dom';

const rootReducer = combineReducers({
  game: gameReducer
})

const store = createStore(rootReducer, applyMiddleware(socketIoMiddleware))

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <Router>
        <BigTwo />
      </Router>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();