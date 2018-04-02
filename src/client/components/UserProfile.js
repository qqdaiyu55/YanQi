import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import Avatar from 'react-avatar-edit'
import Modal from './Modal'
import Auth from '../modules/Auth'
import { uuidv8, MBtoSize, dataURItoBlob } from '../modules/Library'
import ImageCompressor from '@xkeshi/image-compressor'

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
        <ProfileCardWithRouter username={this.props.username} avatarUrl={this.props.avatarUrl} download={this.props.download} upload={this.props.upload} />
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
      preview: null
    }

    this.openAvatarEditor = this.openAvatarEditor.bind(this)
    this.closeAvatarEditor = this.closeAvatarEditor.bind(this)

    this.onCrop = this.onCrop.bind(this)
    this.onClose = this.onClose.bind(this)
    this.updateAvatar = this.updateAvatar.bind(this)

    this.logout = this.logout.bind(this)
  }
  openAvatarEditor() {
    $('#avatar-editor').css({ 'visibility':'visible', 'opacity':'1'})
  }
  closeAvatarEditor() {
    this.setState({
      preview: null
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
    if (!this.state.preview) alert('Please choose a file.')

    // Get the token
    const token = Auth.getToken()

    const file = dataURItoBlob(this.state.preview)
    const imageCompressor = new ImageCompressor()
    // Compress and upload avatar to server
    imageCompressor.compress(file, {
      width: 100,
      height: 100,
      quality: 1
    }).then((result) => {
      const filename = uuidv8()+uuidv8()+'.'+result.type.split('/')[1]
      var fd = new FormData()
      // Append cover file and change the name
      fd.append('avatar', result, filename)
      // A trick: set contentType to false, so the boundary will be added automatically
      $.ajax({
        url: '/upload/avatar',
        headers: { 'Authorization': `bearer ${token}` },
        data: fd,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST'
      }).done(() => {
        this.props.history.push('/')
        window.location.reload()
        console.log('Successfully upload avatar.')
      }).fail(() => {
        console.log('There is an error when uploading avatar.')
      })
    }).catch((err) => {
      console.log('Something wrong when compressing avatar.')
    })

    this.closeAvatarEditor()
  }
  logout() {
    Auth.deauthenticateUser()
    this.props.history.push('/')
  }

  render() {
    const labelStyle = {
      fontSize: '1.25em',
      fontWeight: '700',
      color: '#ecf0f1',
      display: 'inline-block',
      fontFamily: 'sans-serif',
      cursor: 'pointer'
    }
    const borderStyle = {
      border: '2px solid #ecf0f1',
      borderStyle: 'dashed',
      borderRadius: '8px',
      textAlign: 'center'
    }

    return (
      <div id="profile-card">
        <div className='left-panel'>
          <div className="avatar" onClick={this.openAvatarEditor}>
            <img src={'/avatar/'+this.props.avatarUrl} alt='avatar' />
            <div className='overlay'>Change</div>
          </div>
          <div className='logout' onClick={this.logout}>Log out</div>
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
              shadingColor={'black'}
              shadingOpacity={0.6}
              labelStyle={labelStyle}
              borderStyle={borderStyle}
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

ProfileCard.prototypes = {
  avatarUrl: PropTypes.string.isRequired,
  download: PropTypes.number.isRequired,
  upload: PropTypes.number.isRequired
}

const ProfileCardWithRouter = withRouter(ProfileCard)

export default withRouter(UserProfile)
