import React from 'react';
import PropTypes from 'prop-types'
// import AvatarEditor from 'react-avatar-editor';
// import Avatar from 'react-avatar-edit';
import Auth from '../modules/Auth';

class UserProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: ''
    };
  }
  // Show profile card when mouse moves over
  showProfileCard() {
    $("#ProfileCard").show();
  }

  render() {
    return (
      <div className="UserProfile">
        <ProfileCard />
        <div className="User">
          <div className="name">{this.props.username}</div>
          <div className="image" onMouseOver={this.showProfileCard}><img src={'/avatar/'+this.props.avatarUrl} alt='profile' /></div>
        </div>
      </div>
    );
  }
}

class ProfileCard extends React.Component {
  constructor() {
    super();

    this.state = {
      scale: 2
      // preview: null,
      // src
    };
    this.avatarEditor = null;

    this.setAvatarScale = this.setAvatarScale.bind(this);
    this.setEditorRef = this.setEditorRef.bind(this);
    this.submitAvatar = this.submitAvatar.bind(this);

    // this.onCrop = this.onCrop.bind(this);
    // this.onClose = this.onClose.bind(this);
  }

  // onClose() {
  //   this.setState({preview: null})
  // }
  //
  // onClose() {
  //   this.setState({preview: null})
  // }

  hideProfileCard() {
    $("#ProfileCard").hide();
  }

  // Set scale of avatar according to uploaded image
  setAvatarScale(e) {
    this.setState({
      scale: Number(e.target.value)
    });
  }

  submitAvatar() {
    if (this.avatarEditor) {
      let avatar = this.avatarEditor.getImage();
      // console.log(avatar.toBlob('image/png'));
      // avatar.toBlob((blob) => {
      //   console.log(blob);
      // });
      // avatar.toDataURL((blob) => {
      //   console.log(blob);
      // });
      // console.log(avatar.toDataURL());
      avatar.setAttribute("id", "canvas");
      $("#ProfileCard").append(avatar);

      // Get jwt token
      // const token = encodeURIComponent(Auth.getToken());
      // avatar = encodeURIComponent(avatar)
      // const formData = `token=${token}`;
      //
      // // Get user information from server and create an AJAX request
      // const xhr = new XMLHttpRequest();
      // xhr.open('post', '/api/updateAvatar');
      // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      //
      // // set the authorization HTTP header
      // xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
      //
      // xhr.responseType = 'json';
      // xhr.addEventListener('load', () => {
      //   if (xhr.status === 400) {
      //     // this.setState({
      //     //   username: xhr.response.username
      //     // });
      //     console.log(xhr.response.error);
      //   } else {
      //     // this.setState({
      //     //   error: xhr.response.error
      //     // });
      //   }
      // });
      // xhr.send(formData);
    }
  }

  setEditorRef(editor) {
    this.avatarEditor = editor;
  }

  render() {
    return (
      <div id="ProfileCard" onMouseLeave={this.hideProfileCard}>
        <div>
          <p>Upload</p>
          <p>Download</p>
          {/* <Avatar
            width={320}
            height={320}
            onCrop={this.onCrop}
            onClose={this.onClose}
            src={this.state.src}
          /> */}
          {/* <img src={this.state.preview} alt="Preview" /> */}
          {/* <AvatarEditor
            ref={this.setEditorRef}
            image="http://imgtu.5011.net/uploads/content/20170401/2052071491035431.jpg"
            width={100}
            height={100}
            border={30}
            borderRadius={100}
            color={[0, 0, 0, 0.8]} // RGBA
            scale={this.state.scale}
          /> */}
          {/* <input type="range" min="1" max="5" step="0.01" defaultValue="2" onChange={this.setAvatarScale}/> */}
          {/* <button onClick={this.submitAvatar}>submit</button> */}
        </div>
      </div>
    );
  }
}

UserProfile.propTypes = {
  username: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired
}

export default UserProfile;
