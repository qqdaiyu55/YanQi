import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  browserHistory,
  Redirect,
  Switch,
  Route
} from 'react-router-dom';

import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';
import SignUpPage from './containers/SignUpPage';
import Auth from './modules/Auth';

import Hero from './components/Hero.js';
import SearchPage from './containers/SearchPage.js';
import VideoPage from './containers/VideoPage.js';

ReactDOM.render(
  <Router history={browserHistory}>
    <Switch>
      <Route exact path='/' render={() => (
        Auth.isUserAuthenticated() ? (
          <HomePage/>
        ) : (
          <Redirect to='/login' />
        )
      )} />
      <Route path='/login' component={LoginPage} />
      <Route path='/signup' component={SignUpPage} />
      <HomePage>
        <Route exact path="/" component={Hero} />
        <Route path="/search/:term" component={SearchPage} />
        <Route path="/video/:id" component={VideoPage} />
      </HomePage>
    </Switch>
  </Router>,
  document.getElementById('root')
);
