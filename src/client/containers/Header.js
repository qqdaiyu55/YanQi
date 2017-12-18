import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import Logo from '../components/Logo.js'
import UserProfile from './UserProfile.js'
import Modal from './Modal.js'
import EditVideoCard from './EditVideoCard.js'
import Auth from '../modules/Auth'


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
        tags: []
      }
    }

    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  componentWillMount() {
    const token = Auth.getToken()
    const data = { token: token }
    $.ajax({
      url: '/api/profile',
      data: JSON.stringify(data),
      headers: { 'Authorization': `bearer ${token}` },
      contentType: 'application/json',
      method: 'POST'
    }).done((data) => {
      this.setState({
        profile: {
          username: data.username,
          avatarUrl: data.avatarUrl,
          tags: data.tags
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
      this.props.history.push('/search/'+this.state.searchTerm)
    }
  }
  // Set the state when search term is changed
  handleChange(e) {
      this.setState({ searchTerm: e.target.value })
  }
  render() {
    return (
      <header className='Header'>
        <Link to='/'><Logo /></Link>
        <Navigation tags={this.state.profile.tags} />
        <div id='search' className='Search'>
          <input onKeyUp={this.handleKeyUp} onChange={this.handleChange} type='search' placeholder='Search for a title...' value={this.state.searchTerm}/>
        </div>
        <UserProfile username={this.state.profile.username} avatarUrl={this.state.profile.avatarUrl} />
      </header>
    );
  }
}


class Navigation extends React.Component {
  constructor(props) {
    super(props)
    this.tags = []

    this.openTagModal = this.openTagModal.bind(this)
    this.handleTagInputChange = this.handleTagInputChange.bind(this)
    this.addTag = this.addTag.bind(this)
    this.updateTags = this.updateTags.bind(this)

    this.openEditVideoModal = this.openEditVideoModal.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    if (!arraysEqual(this.tags,nextProps.tags)) {
      this.tags = nextProps.tags
      this.forceUpdate()
    }
  }
  componentDidMount() {
    $('.tags-box ul').sortable()
    $('.tags-box').droppable({
      greedy: true,
      accepet: '.ui-sortable-handle'
    })
    $('body').droppable({
      drop: function(e, ui) {
        ui.draggable.remove();
      },
      accept: '.ui-sortable-handle'
    })

    setInterval(this.updateTags, 10000)
  }

  // Update tags
  updateTags() {
    const newTags = $('.tags-box ul').children().map(function() {
      return this.innerHTML
    }).get()

    // Get token from local storage
    const token = Auth.getToken()

    // Judge if new tags and previous tags (5 seconds before) is equal
    if (!arraysEqual(newTags, this.tags)) {
      const data = {
        token: token,
        tags: newTags
      }
      $.ajax({
        url: 'api/updateTags',
        data: JSON.stringify(data),
        headers: {'Authorization': `bearer ${token}`},
        contentType: 'application/json',
        method: 'POST'
      }).fail(() => {
        console.log('There has an error when updating tags.')
      })

      this.tags = newTags;
    }
  }

  // Open create-tag modal when click button
  openTagModal() {
    $('#add-tag-modal').css({'visibility':'visible', 'opacity':'1'})
  }

  // Implement create-tag modal animation when inputing
  handleTagInputChange(e) {
    if (e.target.value == '') {
      $('.tag-modal-buttons div').css('top', '0')
    } else {
      $('.tag-modal-buttons div').css('top', '-50px')
    }
  }

  // If the text is non-empty then add the new tag, else cancel and close the modal.
  addTag() {
    const newTag = $('.add-navigation-tag').find('input').val()
    if(newTag !== '') {
      $('#tagsbox ul').append('<li class="ui-sortable-handle">'+newTag+'</li>')
    }

    $('#add-tag-modal').css({'visibility':'hidden', 'opacity':'0'})
    // Reset modal content
    $('.add-navigation-tag').find('input').val('')
    $('.tag-modal-buttons').find('div').css('top', '0')
  }

  // open edit-video-card
  openEditVideoModal() {
    $('#edit-video-card').css({'visibility':'visible', 'opacity':'1'})
  }

  render() {
    return (
      <div id='navigation' className='Navigation'>
        <nav>
          <ul>
            <li className='tags-box-wrapper'>
              Tags
              <div id='tagsbox' className='tags-box'>
                <div className='tags-box-buttons'>
                  <i className='fa fw fa-plus-square' onClick={this.openTagModal}></i>
                </div>
                <ul>
                  {this.tags.map(tag =>
                    <li key={tag} className='ui-sortable-handle'>{tag}</li>
                  )}
                </ul>
              </div>
            </li>
            <Link to='/list' className='link'><li>My list</li></Link>
            <li>New</li>
            <li>Download</li>
            <li>FAQ</li>
            <li onClick={this.openEditVideoModal}><i className='fa fa-fw fa-plus'></i></li>
          </ul>
        </nav>
        <Modal id='add-tag-modal'>
          <div className='add-navigation-tag'>
            <input type='text' onChange={this.handleTagInputChange}/>
            <div className='tag-modal-buttons' onClick={this.addTag}>
              <div>
                <i className='fa fa-fw fa-times'></i>
                <i className='fa fa-fw fa-check'></i>
              </div>
            </div>
          </div>
        </Modal>
        <Modal id='edit-video-card' show={true}>
          <EditVideoCard />
        </Modal>
      </div>
    );
  }
}

Navigation.propTypes = {
  tags: PropTypes.array.isRequired
}

// Judge if two arrays are equal
var arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false
    for (var i = arr1.length; i--;) {
      if(arr1[i] !== arr2[i])
        return false
    }

    return true
};

export default withRouter(Header);
