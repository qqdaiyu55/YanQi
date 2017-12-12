import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Input from './AuthFormInput.js'


const SignUpForm = ({
  onSubmit,
  onChange,
  errors
}) => (
  <div className="Authentication">
    <div className="AuthForm">
        <div className="Modal">
          {errors.summary && <p className="error-message">{errors.summary}</p>}
          <form
            onSubmit={onSubmit}
            className="ModalForm">
            <AuthFormInput
              name="username"
              type="text"
              placeholder="username"
              onChange={onChange}
            />
            <AuthFormInput
     				  name="password"
     				  type="password"
     				  placeholder="password"
              onChange={onChange}
            />
            <AuthFormInput
     				  name="reinput_password"
     				  type="password"
     				  placeholder="repeat password"
              onChange={onChange}
            />
            <button className="Button">Sign up</button>
            <p>Already have an account? <Link to={'/login'} className="Link">Log in</Link></p>
          </form>
        </div>
    </div>
  </div>
);

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default SignUpForm;
