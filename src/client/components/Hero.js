import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => (
  <div id="hero" className="Hero" style={{backgroundImage: 'url(/img/GhostBlade_Aeolian.jpg)'}}>
    <div className="content">
      <img className="logo" src="http://www.returndates.com/backgrounds/narcos.logo.png" alt="narcos background" />
      <h2>Season 2 now available</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque id quam sapiente unde voluptatum alias vero debitis, magnam quis quod.</p>
      <div className="button-wrapper">
        <Link to='/video/5a361ddc1ee0d9fd34f570fd' className="Button" data-primary={true} style={{ textDecoration: 'none' }}>Watch now</Link>
        <a className="Button" data-primary={false}>+ My list</a>
      </div>
    </div>
    <div className="overlay"></div>
  </div>
);


export default Hero;
