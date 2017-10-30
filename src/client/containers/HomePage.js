import React from 'react';
import Logo from '../components/Logo.js';
import { Video } from './Video.js';
import Hero from '../components/Hero.js';
import TitleList from '../components/TitleList.js';
import UserProfile from './UserProfile.js';
import EditVideoCard from './EditVideoCard.js'
import Modal from './Modal.js'
import Auth from '../modules/Auth';
// import Rodal from 'rodal';
// import Modal from 'react-awesome-modal';

// User tags
var tags = ['电影', '动漫', 'MV', 'HBO', 'AMV', '行尸走肉', '小埋'];

class Homepage extends React.Component {
  constructor() {
    super();
    this.apiKey = '87dfa1c669eea853da609d4968d294be';
    this.state = {
      searchTerm: '',
      searchUrl: ''
    };

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // Process the search
  handleKeyUp(e) {
    if (e.key === 'Enter' && this.state.searchTerm !== '') {
      let searchUrl = "search/multi?query=" + this.state.searchTerm + "&api_key=" + this.apiKey;
      this.setState({searchUrl: searchUrl});
    }
  }

  // Set the state when search term is changed
  handleChange(e) {
      this.setState({searchTerm : e.target.value});
  }

  render() {
    return (
      <div>
        <header className="Header">
          <Logo />
          <Navigation plusOnClick={this.createNew} />
          <div id="search" className="Search">
            <input onKeyUp={this.handleKeyUp} onChange={this.handleChange} type="search" placeholder="Search for a title..." value={this.state.searchTerm}/>
          </div>
          <UserProfile />
        </header>
        <Hero />
        <Video />
        <TitleList title="Search Results" url={this.state.searchUrl} />
      </div>
    );
  }
}

// Navigation
// Note: There has to update modal state manually instead of pass show property of modal, or there'll be a conflict with droppable ul when rerendering: **Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node**.
class Navigation extends React.Component {
  constructor() {
    super();

    this.openTagModal = this.openTagModal.bind(this);
    this.handleTagInputChange = this.handleTagInputChange.bind(this);
    this.addTag = this.addTag.bind(this);
    this.openEditVideoModal = this.openEditVideoModal.bind(this);
  }

  componentDidMount() {
    $(".tags-box ul").sortable({
      // If you want to use 'animation_direction' and 'animation' option, please include jquery-ui script in index.html
      // animation_direction: 'x',
      // animation: 200
    });
    $(".tags-box").droppable({greedy: true});
    $("body").droppable({
      drop: function(e, ui) {
        ui.draggable.remove();
      }
    });

    // Send updated tags to server if they were changed
    setInterval(function() {
      const newTags = $(".tags-box ul").children().map(function() {
        return this.innerHTML;
      }).get();

      // Get token from local storage
      const token = Auth.getToken();

      // Judge if new tags and previous tags (5 seconds before) is equal
      if (!arraysEqual(newTags, tags)) {
        var xhr = new XMLHttpRequest();
        xhr.open('post', '/api/updateTags');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // set the authorization HTTP header
        xhr.setRequestHeader('Authorization', `bearer ${token}`);
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
          if (xhr.status === 400) {
            const error = xhr.response.error;
            console.log(error);
          }
        });

        xhr.send('json=' + JSON.stringify({
          token: token,
          tags: newTags
        }));

        tags = newTags;
      }
    }, 10000);
  }

  // Open create-tag modal when click button
  openTagModal() {
    $("#add-tag-modal").css({"visibility":"visible", "opacity":"1"});
  }
  // Implement create-tag modal animation when inputing
  handleTagInputChange(e) {
    if (e.target.value == '') {
      $(".tag-modal-buttons div").css("top", "0");
    } else {
      $(".tag-modal-buttons div").css("top", "-50px");
    }
  }
  // If the text is non-empty then add the new tag, else cancel and close the modal.
  addTag() {
    const newTag = $(".add-navigation-tag").find("input").val();
    if(newTag !== '') {
      $("#tagsbox ul").append('<li class="ui-sortable-handle">'+newTag+'</li>');
    }

    $("#add-tag-modal").css({"visibility":"hidden", "opacity":"0"});
    // Reset modal content
    $(".add-navigation-tag").find("input").val('')
    $(".tag-modal-buttons").find("div").css("top", "0");
  }
  // open edit-video-card
  openEditVideoModal() {
    $("#edit-video-card").css({"visibility":"visible", "opacity":"1"});
  }
  render() {
    return (
      <div id="navigation" className="Navigation">
        <nav>
          <ul>
            <li className="tags-box-wrapper">
              Tags
              <div id="tagsbox" className="tags-box">
                <div className="tags-box-buttons">
                  <i className="fa fw fa-plus-square" onClick={this.openTagModal}></i>
                </div>
                <ul>
                  {tags.map(tag =>
                    <li key={tag}>{tag}</li>
                  )}
                </ul>
              </div>
            </li>
            <li>My list</li>
            <li>New</li>
            <li>Download</li>
            <li>FAQ</li>
            <li onClick={this.openEditVideoModal}><i className="fa fa-fw fa-plus"></i></li>
          </ul>
        </nav>
        <Modal id="add-tag-modal">
          <div className="add-navigation-tag">
            <input type="text" onChange={this.handleTagInputChange}/>
            <div className="tag-modal-buttons" onClick={this.addTag}>
              <div>
                <i className="fa fa-fw fa-times"></i>
                <i className="fa fa-fw fa-check"></i>
              </div>
            </div>
          </div>
        </Modal>
        <Modal id="edit-video-card" show={true}>
          <EditVideoCard />
        </Modal>
      </div>
    );
  }
}

// Judge if two arrays are equal
var arraysEqual = (arr1, arr2) => {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
};


export default Homepage;
