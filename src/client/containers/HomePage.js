import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import { Video } from './Video.js'
import Header from './Header.js'
import Hero from '../components/Hero.js'
import SearchPage from './SearchPage.js'
import VideoPage from './VideoPage.js'


const Homepage = () => (
  <div>
    <Header />
    <Video />
    <Route exact path="/" component={Hero} />
    <Route path="/search/:term" component={SearchPage} />
    <Route path="/video/:id" component={VideoPage} />
  </div>
);


export default Homepage;
