import React from 'react';
import Logo from '../components/Logo.js';
import { Video } from './Video.js';
import Hero from '../components/Hero.js';
import TitleList from '../components/TitleList.js';
import UserProfile from './UserProfile.js';
import EditVideoCard from './EditVideoCard.js'
import Modal from './Modal.js'
// import Rodal from 'rodal';
// import Modal from 'react-awesome-modal';


class Homepage extends React.Component {
  constructor() {
    super();
    this.apiKey = '87dfa1c669eea853da609d4968d294be';
    this.state = {
      searchTerm: '',
      searchUrl: '',
      createModalVisible: false
    };

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.createNew = this.createNew.bind(this);
    this.closeNew = this.closeNew.bind(this);
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

  createNew() {
    this.setState({createModalVisible: true});
  }

  closeNew() {
    this.setState({createModalVisible: false});
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
        {/* <Rodal visible={this.state.createModalVisible} width={400} height={400} className="vv" onClose={this.closeNew} closeOnEsc={true}>
          <div>Content</div>
          <button onClick={this.closeNew}>close</button>
        </Rodal> */}
        {/* <Modal visible={this.state.createModalVisible} width={"400"} effect={"fadeInUp"} onClickAway={this.closeNew}>
          <div>
              <h1>Title</h1>
              <p>Some Contents</p>
              <button onClick={this.closeNew}>Close</button>
          </div>
        </Modal> */}
        {/* <EditVideoCard /> */}
        <TitleList title="Search Results" url={this.state.searchUrl} />

      </div>
    );
  }
}

// Navigation
class Navigation extends React.Component {
  constructor() {
    super();
    this.state = {
      isTagModalOpen: false,
      tags: ['电影', '动漫', 'MV', 'HBO', 'AMV', '行尸走肉', '小埋']
    };

    this.openTagModal = this.openTagModal.bind(this);
  }

  openTagModal() {

  }

  componentDidMount() {
    $('.tags-box').find("ul").sortable({
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
  }

  componentWillUnmount() {
    console.log("Over");
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
                  {/* <i className="fa fw fa-plus-circle"></i> */}
                  <i className="fa fw fa-plus-square" onClick={this.openTagModal}></i>
                </div>
                <ul>
                  {this.state.tags.map(tag =>
                    <li key={tag}>{tag}</li>
                  )}
                </ul>
              </div>
            </li>
            <li>My list</li>
            <li>New</li>
            <li>FAQ</li>
            <li><i className="fa fa-fw fa-plus"></i></li>
          </ul>
        </nav>
        <Modal>
          <div className="add-navigation-tag">
            <input type="text"/>
          </div>
        </Modal>
      </div>
    );
  }
}


export default Homepage;
