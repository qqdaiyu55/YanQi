import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import Auth from '../modules/Auth'
import Navigation from '../components/Navigation'
import UserProfile from '../components/UserProfile'


// Navigation
// Note: There has to update modal state manually instead of pass show property of modal, or there'll be a conflict with droppable ul when rerendering: **Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node**.
class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      profile: {
        username: '',
        avatarUrl: '',
        download: 0,
        upload: 0,
      }
    }

    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  componentWillMount() {
    const token = Auth.getToken()
    $.ajax({
      url: '/api/profile',
      headers: { 'Authorization': `bearer ${token}` },
      contentType: 'application/json',
      method: 'GET'
    }).done((data) => {
      this.setState({
        profile: {
          username: data.username,
          avatarUrl: data.avatarUrl,
          download: data.download,
          upload: data.upload
        }
      })
    }).fail(() => {
      console.log('There is an error when getting user profile.')
    })
  }
  // Process the search
  handleKeyUp(e) {
    if (e.key === 'Enter' && this.state.searchTerm !== '') {

      // Redirect to '/search'
      this.props.history.push('/search/title='+this.state.searchTerm)
    }
  }
  // Set the state when search term is changed
  handleChange(e) {
      this.setState({ searchTerm: e.target.value })
  }
  render() {
    return (
      <header className='Header'>
        <Link to='/'><div className='logo'></div></Link>
        <Navigation />
        <div id='search' className='Search'>
          <input onKeyUp={this.handleKeyUp} onChange={this.handleChange} type='search' placeholder='Search for a title...' value={this.state.searchTerm}/>
        </div>
        <UserProfile username={this.state.profile.username} avatarUrl={this.state.profile.avatarUrl} download={this.state.profile.download} upload={this.state.profile.upload} />
      </header>
    );
  }
}


export default withRouter(Header);
