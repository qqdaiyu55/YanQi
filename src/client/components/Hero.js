import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => (
  <div id="hero" className="Hero" style={{ backgroundImage: 'url(/img/g0i4vc7unqakxeeano9p.png)'}}>
    <div className="content">
      {/* <img className="logo" src="/img/black-mirror-uproxx-1.jpg" alt="BLACK MIRROR" /> */}
      {/* http://www.returndates.com/backgrounds/narcos.logo.png */}
      <h1>BLACK MIRROR</h1>
      <h2>Season 4 now available</h2>
      <p>Black Mirror is a British television series created by Charlie Brooker. The series is produced by Zeppotron for Endemol.</p>
      <div className="button-wrapper">
        <Link to='/video/5a3bcc52b1d6692551c19ec3' className="Button" data-primary={true} style={{ textDecoration: 'none' }}>Watch now</Link>
        <a className="Button" data-primary={false}>+ My list</a>
      </div>
    </div>
    <div className="overlay"></div>
  </div>
);


export default Hero;
