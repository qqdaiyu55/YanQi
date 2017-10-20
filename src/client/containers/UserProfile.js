import React from 'react';

class UserProfile extends React.Component {
  constructor() {
    super();

    this.showProfile = this.showProfile.bind(this);
    this.hideProfile = this.hideProfile.bind(this);
  }

  showProfile() {
    $("#ProfileCard").show();
  }

  hideProfile() {
    $("#ProfileCard").hide();
  }

  render() {
    return (
      <div className="UserProfile">
        <div id="ProfileCard" onMouseOut={this.hideProfile}></div>
        <div className="User">
          <div className="name">DAIYU</div>
          <div className="image" onMouseOver={this.showProfile}><img src="http://www.avatarsdb.com/avatars/waifu.jpg" alt="profile" /></div>
        </div>
      </div>
    );
  }
}

export default UserProfile;
