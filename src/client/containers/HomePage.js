import React from 'react';
import Logo from '../components/Logo.js';
import { Video } from './Video.js';
import Hero from '../components/Hero.js';
import TitleList from '../components/TitleList.js';
import UserProfile from './UserProfile.js';
import EditVideoCard from './EditVideoCard.js'
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
        {/* <TitleList title="Top TV picks for Jack" url='discover/tv?sort_by=popularity.desc&page=1' />
        <TitleList title="Trending now" url='discover/movie?sort_by=popularity.desc&page=1' />
        <TitleList title="Most watched in Horror" url='genre/27/movies?sort_by=popularity.desc&page=1' />
        <TitleList title="Sci-Fi greats" url='genre/878/movies?sort_by=popularity.desc&page=1' />
        <TitleList title="Comedy magic" url='genre/35/movies?sort_by=popularity.desc&page=1' /> */}

      </div>
    );
  }
}


const customStyle = {
  height: "auto",
  bottom: "auto",
  top: "30%",
  background: "white"
};

// Navigation
const Navigation = ({
  plusOnClick
}) => (
  <div id="navigation" className="Navigation">
    <nav>
      <ul>
        <li>Tags</li>
        <li>My lists</li>
        <li>New</li>
        <li>FAQ</li>
        <li onClick={plusOnClick}><i className="fa fa-fw fa-plus"></i></li>
      </ul>
    </nav>
  </div>
)


export default Homepage;
