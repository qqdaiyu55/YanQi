import React from 'react'
import SignUpForm from '../components/SignUpForm.js'
import { withRouter } from 'react-router-dom'


class SignUpPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      errors: {},
      user: {
        username: '',
        password: '',
        reinput_password: ''
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
    const reinput_password = encodeURIComponent(this.state.user.reinput_password)
    const formData = `username=${username}&password=${password}`

    // Check if the user input the same password twice
    if (password != reinput_password) {
      const errors = {}
      errors.summary = 'Please confirm your password!'
      this.setState({
        errors
      })
      return
    }

    // Create an AJAX request
    const xhr = new XMLHttpRequest()
    xhr.open('post', '/auth/signup')
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.responseType = 'json'
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // Success

        // Change the component-container state
        this.setState({
          errors: {}
        })

        // Set a message
        localStorage.setItem('successMessage', xhr.response.message)

        // Make a redirect
        this.props.history.push('/')
      } else {
        // Failure

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
      <SignUpForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
      />
    )
  }

}

export default withRouter(SignUpPage)
