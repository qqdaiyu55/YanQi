import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => (
  <div id="hero" className="Hero" style={{ backgroundImage: 'url(https://i.imgur.com/IaM7dwt.jpg)'}}>
    <div className="content">
      <h1>COCO</h1>
      <p>In Santa Cecilia, Mexico, Imelda Rivera was the wife of a musician, who left her and their 3-year-old daughter Coco, to pursue a career in music. When he never returns, Imelda banishes music from her life and that of her family and opens a shoemaking family business...</p>
      <div className="button-wrapper">
        <Link to='/video/5a3bcc52b1d6692551c19ec3' className="Button" data-primary={true} style={{ textDecoration: 'none' }}>Watch now</Link>
      </div>
    </div>
    <div className="overlay"></div>
  </div>
)


export default Hero
