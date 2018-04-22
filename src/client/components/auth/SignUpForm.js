import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import AuthFormInput from './AuthFormInput.js'


const SignUpForm = ({
  onSubmit,
  onChange,
  errors
}) => (
  <div className='auth-page'>
    <div className='auth-form'>
        <div className='modal'>
          {errors.summary && <p className='error-message'>{errors.summary}</p>}
          <form onSubmit={onSubmit}>
            <AuthFormInput
              name='username'
              type='text'
              placeholder='username'
              onChange={onChange}
            />
            <AuthFormInput
     				  name='password'
     				  type='password'
     				  placeholder='password'
              onChange={onChange}
            />
            <AuthFormInput
     				  name='repeatPassword'
     				  type='password'
     				  placeholder='repeat password'
              onChange={onChange}
            />
            <AuthFormInput
              name='inviteCode'
              type='text'
              placeholder='invite code'
              onChange={onChange}
            />
            <button className='auth-form-btn'>Sign up</button>
            <p>Already have an account? <Link to={'/login'} className='link'>Log in</Link><br/>
              <a href="https://github.com/qqdaiyu55/yanqi.tv/wiki/%E7%94%B3%E8%AF%B7%E9%82%80%E8%AF%B7%E7%A0%81" style={{ textDecoration: 'none', color: '#DD403A' }}>How to apply for invite code?</a></p>
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
