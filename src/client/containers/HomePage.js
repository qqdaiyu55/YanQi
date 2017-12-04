import React from 'react';
import { Video } from './Video.js';
import Header from './Header.js';
import Hero from '../components/Hero.js';

class Homepage extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Header />
        <Hero />
        <Video />
        {/* <TitleList title="Search Results" url={this.state.searchUrl} /> */}
      </div>
    );
  }
}


export default Homepage;
