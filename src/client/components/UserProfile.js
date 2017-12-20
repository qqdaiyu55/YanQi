import React from 'react'
import PropTypes from 'prop-types'
// import AvatarEditor from 'react-avatar-editor';
import Avatar from 'react-avatar-edit'
import Modal from './Modal'
import Auth from '../modules/Auth'
import { MBtoSize } from '../modules/Library'

class UserProfile extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    $(document).click(function(e) {
      var target = e.target

      // When profile card is visible, hide the card on click of anything else on the page
      if ($('#profile-card').css('opacity') === '1' && $('#avatar-editor').css('opacity') === '0' && !$(target).is('#profile-card') && !$(target).parents().is('#profile-card')) {
          $('#profile-card').css({ 'visibility':'hidden', 'opacity':'0' })
      }
    })
  }
  // Show profile card when mouse moves over
  showProfileCard() {
    $("#profile-card").css({ 'visibility':'visible', 'opacity':'1' });
  }

  render() {
    return (
      <div className='profile'>
        <ProfileCard username={this.props.username} avatarUrl={this.props.avatarUrl} download={this.props.download} upload={this.props.upload} />
        <div className='user'>
          <div className='name'>{this.props.username}</div>
          <div className='image' onClick={this.showProfileCard}><img src={'/avatar/'+this.props.avatarUrl} alt='avatar' /></div>
        </div>
      </div>
    );
  }
}

class ProfileCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      preview: null,
      src: '/avatar/default.jpg'
    }

    this.openAvatarEditor = this.openAvatarEditor.bind(this)
    this.closeAvatarEditor = this.closeAvatarEditor.bind(this)

    this.onCrop = this.onCrop.bind(this)
    this.onClose = this.onClose.bind(this)
    this.updateAvatar = this.updateAvatar.bind(this)
  }
  openAvatarEditor() {
    $('#avatar-editor').css({ 'visibility':'visible', 'opacity':'1'})
  }
  closeAvatarEditor() {
    this.setState({
      preview: null,
      src: '/avatar/default.jpg'
    })
    $('#avatar-editor').css({ 'visibility':'hidden', 'opacity':'0'})
  }
  onClose() {
    this.setState({ preview: null })
  }
  onCrop(preview) {
    this.setState({ preview })
  }
  updateAvatar() {
    
  }

  render() {
    return (
      <div id="profile-card">
        <div className='left-panel'>
          <div className="avatar" onClick={this.openAvatarEditor}>
            <img src={'/avatar/default.jpg'} alt='avatar' />
            <div className='overlay'>Change</div>
          </div>
        </div>
        <div className='right-panel'>
          <div className='profile-data-wrapper'>
            <div className='profile-data' data-type='download'>{MBtoSize(this.props.download)}</div>
            <div className='profile-data' data-type='upload'>{MBtoSize(this.props.upload)}</div>
            <div className='profile-data' data-type='rate'>{((this.props.download+1)/(this.props.upload+1)).toFixed(2)}</div>
          </div>
        </div>
        <Modal id='avatar-editor'>
          <div className='modal'>
            <div className='avatar-file-loader'>
              <Avatar
              width={200}
              height={200}
              onCrop={this.onCrop}
              onClose={this.onClose}
              src={this.state.src}
              shadingColor={'black'}
              shadingOpacity={0.6}
              />
            </div>
            <div className='avatar-editor-right'>
              <img src={this.state.preview} alt='Preview' />
              <div className='button-wrapper'>
                <div button-type='submit' onClick={this.updateAvatar}>Upload</div>
                <div button-type='cancel' onClick={this.closeAvatarEditor}>Cancel</div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

UserProfile.propTypes = {
  username: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
  download: PropTypes.number.isRequired,
  upload: PropTypes.number.isRequired
}

export default UserProfile;
