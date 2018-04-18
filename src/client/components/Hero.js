import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => (
  <div id="hero" className="Hero" style={{ backgroundImage: 'url(https://i.imgur.com/DzjCHr3.jpg)'}}>
    <div className="content">
      <h1>VIOLET EVERGARDEN</h1>
      <p>The story revolves around Auto Memory Dolls (自動手記人形 Jidō Shuki Ningyō): people initially employed by a scientist named Dr. Orland to assist his blind wife Mollie in writing her novels, and later rented out to other people who needed their services...</p>
      <div className="button-wrapper">
        <Link to='/video/5a3bcc52b1d6692551c19ec3' className="Button" data-primary={true} style={{ textDecoration: 'none' }}>Watch now</Link>
      </div>
    </div>
    <div className="overlay"></div>
  </div>
)


export default Hero
