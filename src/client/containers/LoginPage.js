import React from 'react'
import Auth from '../modules/Auth'
import LoginForm from '../components/auth/LoginForm'
import { withRouter } from 'react-router-dom'


class LoginPage extends React.Component {
  constructor() {
    super()

    const storedMessage = localStorage.getItem('successMessage')
    var successMessage = ''

    if (storedMessage) {
      successMessage = storedMessage
      localStorage.removeItem('successMessage')
    }

    // set the initial component state
    this.state = {
      errors: {},
      successMessage,
      user: {
        username: '',
        password: ''
      }
    };

    this.processForm = this.processForm.bind(this)
    this.changeUser = this.changeUser.bind(this)
  }

  // Process the form
  processForm(event) {
    // Prevent default action. in this case, action is the form submission event
    event.preventDefault()

    // Create a string for an HTTP body message
    const username = encodeURIComponent(this.state.user.username)
    const password = encodeURIComponent(this.state.user.password)
    const formData = `username=${username}&password=${password}`

    // Create an AJAX request
    const xhr = new XMLHttpRequest()
    xhr.open('post', '/auth/login')
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.responseType = 'json'
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // Success

        // Change the component-container state
        this.setState({
          errors: {}
        })

        // Save the token
        Auth.authenticateUser(xhr.response.token)

        // Redirect to /
        this.props.history.push('/')

      } else {
        // failure

        // change the component state
        const errors = xhr.response.errors ? xhr.response.errors : {}
        errors.summary = xhr.response.message

        this.setState({
          errors
        })
      }
    })
    xhr.send(formData)
  }

  // Change the user object
  changeUser(event) {
    const field = event.target.name
    const user = this.state.user
    user[field] = event.target.value

    this.setState({
      user
    })
  }

  render() {
    return (
      <LoginForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
      />
    );
  }

}

export default withRouter(LoginPage);
