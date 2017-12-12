import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  browserHistory,
  Redirect,
  Switch,
  Route
} from 'react-router-dom'

import HomePage from './containers/HomePage'
import LoginPage from './containers/LoginPage'
import SignUpPage from './containers/SignUpPage'
import Auth from './modules/Auth'

ReactDOM.render(
  <Router history={browserHistory}>
    <Switch>
      <Route exact path='/login' component={LoginPage} />
      <Route exact path='/signup' component={SignUpPage} />
      <Route path='/' render={() => (
        Auth.isUserAuthenticated() ? (
          <HomePage />
        ) : (
          <Redirect to='/login' />
        )
      )} />
    </Switch>
  </Router>,
  document.getElementById('root')
)
