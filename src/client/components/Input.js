// import React, { PropTypes } from 'react';
import React from 'react';
// import './login.css';

const Input = ({
  name,
  type,
  placeholder,
  onChange
}) => (
	<div className="Input">
		<input
			name={name}
			autoComplete="false"
			required
			type={type}
			placeholder={placeholder}
      onChange={onChange}
		/>
		<label htmlFor={name}></label>
	</div>
);

export default Input;
