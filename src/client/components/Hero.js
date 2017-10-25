import React from 'react';
import { displayVideo } from '../containers/Video.js';

const Hero = () => (
  <div id="hero" className="Hero" style={{backgroundImage: 'url(https://images.alphacoders.com/633/633643.jpg)'}}>
    <div className="content">
      <img className="logo" src="http://www.returndates.com/backgrounds/narcos.logo.png" alt="narcos background" />
      <h2>Season 2 now available</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque id quam sapiente unde voluptatum alias vero debitis, magnam quis quod.</p>
      <div className="button-wrapper">
        <HeroButton primary={true} text="Watch now" />
        <HeroButton primary={false} text="+ My list" />
      </div>
    </div>
    <div className="overlay"></div>
  </div>
);

// Hero Button
class HeroButton extends React.Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    document.getElementsByClassName("VideoPopup")[0].style.display = 'block'
    displayVideo({torrentID: 'magnet:?xt=urn:btih:6760314e7f754a2184fe3dff4b8c6d1b33f49fd9&dn=%5BJYFanSub%5D%5BBoku+Dake+ga+Inai+Machi%5D%5B12%5D%5BGB%5D%5B720P%5D.mp4&tr=udp%3A%2F%2F%5B2604%3Aa880%3A1%3A20%3A%3A40%3A4001%5D%3A8000&tr=ws%3A%2F%2F%5B2604%3Aa880%3A1%3A20%3A%3A40%3A4001%5D%3A8000'})
  }
  render() {
    return (
      <button onClick={this.handleClick} className="Button" data-primary={this.props.primary}>{this.props.text}</button>
    );
  }
}


export default Hero;
