import React from 'react';
import { Link } from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from 'prop-types';
import Input from './Input.js'


const SignUpForm = ({
  onSubmit,
  onChange,
  errors
}) => (
  <div className="Authentication">
    <div className="AuthForm">
      <ReactCSSTransitionGroup
        transitionName="example"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}>
        <div className="Modal">
          {errors.summary && <p className="error-message">{errors.summary}</p>}
          <form
            onSubmit={onSubmit}
            className="ModalForm">
            <Input
              name="username"
              type="text"
              placeholder="username"
              onChange={onChange}
            />
            <Input
     				  name="password"
     				  type="password"
     				  placeholder="password"
              onChange={onChange}
            />
            <Input
     				  name="reinput_password"
     				  type="password"
     				  placeholder="re-input password"
              onChange={onChange}
            />
            <button className="Button">Sign up</button>
            <p>Already have an account? <Link to={'/login'} className="Link">Log in</Link></p>
          </form>
        </div>
      </ReactCSSTransitionGroup>
    </div>
  </div>
);

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default SignUpForm;
