import React from 'react'
import './navBar.scss';
import logo from '../../assets/logoSMA.png';

export default function NavBar() {
  return (
    <div className="navBar">
      <div className="logoSekolah">
        <img src={logo} alt="" />
        <span>SMA YUPPENTEK 1</span>
      </div>
      <div className="user">
        <img src={logo} alt="" />
      </div>
    </div>
  )
}
