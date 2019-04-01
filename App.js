import React, { Component } from 'react';

import ConnectContainer from './src/component/ConnectContainer';

import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import { connectReducer } from './src/store/connect.reducer';
import { mangaReducer } from './src/store/manga.reducer';
import { imageReducer } from './src/store/image.reducer';

const reducers = combineReducers({
  connect: connectReducer,
  manga: mangaReducer,
  image: imageReducer,
});
const logger = createLogger({
  level: 'log',
});

const store = createStore(reducers, applyMiddleware(thunk, logger));

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectContainer />
      </Provider>
    );
  }
}
