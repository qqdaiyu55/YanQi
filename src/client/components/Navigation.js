import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import Modal from './Modal'
import EditVideoCard from './EditVideoCard'
import Auth from '../modules/Auth'
import { arraysEqual, uuidv8 } from '../modules/Library'


class Navigation extends React.Component {
  constructor(props) {
    super(props)
    this.tags = []

    this.openTagModal = this.openTagModal.bind(this)
    this.handleTagInputChange = this.handleTagInputChange.bind(this)
    this.addTag = this.addTag.bind(this)
    this.updateTags = this.updateTags.bind(this)
    this.searchTag = this.searchTag.bind(this)

    this.openEditVideoModal = this.openEditVideoModal.bind(this)
  }
  componentWillMount() {
    const token = Auth.getToken()
    $.ajax({
      url: '/api/profile',
      headers: { 'Authorization': `bearer ${token}` },
      contentType: 'application/json',
      method: 'GET'
    }).done((data) => {
      this.tags = data.tags
      this.forceUpdate()
    }).fail(() => {
      console.log('There is an error when getting user profile.')
    })
  }
  componentDidMount() {
    $('.tags-box ul').sortable()
    // $('.tags-box').droppable({
    //   // greedy: true,
    //   activeClass: 'ui-state-hover',
    //   drop: (e, ui) => {
    //     console.log(ui.draggable[0].innerHTML)
    //   },
    //   accepet: '.tags-box .ui-sortable-handle'
    // })
    $('#root').droppable({
      drop: ((e, ui) => {
        // ui.draggable.remove()
        const removeTag = ui.draggable[0].innerHTML
        console.log(ui.draggable[0].innerHTML)
        // this.tags = this.tags.filter(t => t!==removeTag)
        // console.log(this.tags)
        // this.tags = newTags
        // this.forceUpdate()
      }).bind(this),
      accept: '.ui-sortable-handle'
    })

    // setInterval(this.updateTags, 10000)
  }
  componentWillUpdate() {
    console.log('Update.')
  }

  // Update tags
  updateTags() {
    const newTags = $('.tags-box ul').children().map(function() {
      return this.innerHTML
    }).get()
    console.log(newTags)

    // Get token from local storage
    const token = Auth.getToken()

    // Judge if new tags and previous tags (5 seconds before) is equal
    if (!arraysEqual(newTags, this.tags)) {
      const data = {
        token: token,
        tags: newTags
      }
      $.ajax({
        url: '/update/tags',
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
    $('#add-tag-modal').css({ 'visibility':'visible', 'opacity':'1' })
  }

  // Implement create-tag modal animation when inputing
  handleTagInputChange(e) {
    if (e.target.value == '') {
      $('.tag-modal-buttons div').css('top', '0')
    } else {
      $('.tag-modal-buttons div').css('top', '-50px')
    }
  }

  // If the tag-box input field is non-empty then add the new tag, else cancel and close the modal.
  addTag() {
    const newTag = $('.add-navigation-tag').find('input').val()
    if(newTag !== '') {
      this.tags = $('.tags-box ul').children().map(function() {
        return this.innerHTML
      }).get()
      this.tags.push(newTag)
      this.forceUpdate()

      // Update tags when adding a new tag
      const token = Auth.getToken()
      const data = {
        token: token,
        tags: this.tags
      }
      $.ajax({
        url: '/update/tags',
        data: JSON.stringify(data),
        headers: {'Authorization': `bearer ${token}`},
        contentType: 'application/json',
        method: 'POST'
      }).fail(() => {
        console.log('There has an error when updating tags.')
      })
    }

    $('#add-tag-modal').css({'visibility':'hidden', 'opacity':'0'})
    // Reset modal content
    $('.add-navigation-tag').find('input').val('')
    $('.tag-modal-buttons').find('div').css('top', '0')
  }

  // Search for the tag
  searchTag(e) {
    this.props.history.push('/search/tag='+e.target.innerHTML)
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
                    <li key={uuidv8()} className='ui-sortable-handle' onClick={this.searchTag}>{tag}</li>
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

export default withRouter(Navigation)
