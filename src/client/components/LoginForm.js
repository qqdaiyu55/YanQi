import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Input from './Input.js'


const LoginForm = ({
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
            <button className="Button">Log in</button>
            <p>Don't have an account? <Link to={'/signup'} className="Link">Create one</Link></p>
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
