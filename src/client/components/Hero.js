import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => (
  <div id="hero" className="Hero" style={{ backgroundImage: 'url(/img/GhostBlade_Aeolian.jpg)'}}>
    <div className="content">
      <h1>BLACK MIRROR</h1>
      <h2>Season 4 now available</h2>
      <p>Black Mirror is a British television series created by Charlie Brooker. The series is produced by Zeppotron for Endemol.</p>
      <div className="button-wrapper">
        <Link to='/video/5a3bcc52b1d6692551c19ec3' className="Button" data-primary={true} style={{ textDecoration: 'none' }}>Watch now</Link>
      </div>
    </div>
    <div className="overlay"></div>
  </div>
);


export default Hero;
