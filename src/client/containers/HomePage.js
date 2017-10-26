import React from 'react';
import Logo from '../components/Logo.js';
import { Video } from './Video.js';
import Hero from '../components/Hero.js';
import TitleList from '../components/TitleList.js';
import UserProfile from './UserProfile.js';
import EditVideoCard from './EditVideoCard.js'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
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

const SortableItem = SortableElement(({value}) =>
  <li>{value}</li>
);

const SortableList = SortableContainer(({items}) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </ul>
  );
});

class SortableComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      items: ['电影', '动漫', 'MV', 'HBO']
    };

    this.onSortEnd = this.onSortEnd.bind(this);
  }
  onSortEnd({
    oldIndex,
    newIndex
  }) {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    });
  };
  render() {
    return <SortableList axis="xy" items={this.state.items} onSortEnd={this.onSortEnd} />;
  }
}

// Navigation
const Navigation = ({
  plusOnClick
}) => (
  <div id="navigation" className="Navigation">
    <nav>
      <ul>
        <li className="tags-box-wrapper">
          Tags
          <div id="tagsbox" className="tags-box">
            <div className="tags-box-buttons">
              <i className="fa fw fa-plus"></i>
              <i className="fa fw fa-trash-o"></i>
            </div>
            <SortableComponent />
          </div>
        </li>
        <li>My lists</li>
        <li>New</li>
        <li>FAQ</li>
        <li onClick={plusOnClick}><i className="fa fa-fw fa-plus"></i></li>
      </ul>
    </nav>
  </div>
)


export default Homepage;
