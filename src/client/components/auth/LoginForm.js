import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import AuthFormInput from './AuthFormInput.js'


const LoginForm = ({
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
            <button className="auth-form-btn">Log in</button>
            <p>Don't have an account? <Link to={'/signup'} className="link">Create one</Link></p>
          </form>
        </div>
    </div>
  </div>
)

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
}

export default LoginForm
