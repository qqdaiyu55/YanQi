import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  browserHistory,
  Redirect,
  Switch,
  Route
} from 'react-router-dom';
// import routes from './routes.js';
import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';
import SignUpPage from './containers/SignUpPage';
import Auth from './modules/Auth';

ReactDOM.render(
  // <Router history={browserHistory} routes={routes}/>,
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
    </Switch>
  </Router>,
  document.getElementById('root')
);
