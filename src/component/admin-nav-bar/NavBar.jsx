import React from 'react'
import './navBar.scss';
import logo from '../../assets/logoSMA.png';
import CIcon from '@coreui/icons-react';
import { cilUser } from '@coreui/icons'

export default function NavBar() {
  return (
    <div className="navBar">
      <div className="logoSekolah">
        <img src={logo} alt="" />
        <span>SMA YUPPENTEK 1</span>
      </div>
      <div className="user">
        <div className="userBorder">
          <CIcon icon={cilUser} size='xl' />
        </div>
      </div>
    </div>
  )
}
import React from 'react'
import './navBar.scss';
import logo from '../../assets/logoSMA.png';
// import CIcon from '@coreui/icons-react';
// import { cilUser } from '@coreui/icons'

export default function NavBar() {
  return (
    <>
      <div className="navBar">
        <div className="logoSekolah">
          <img src={logo} alt="" />
          <span>SMA YUPPENTEK 1</span>
        </div>
        {/* <div className="user">
          <div className="userBorder">
            <CIcon icon={cilUser} size='xl' />
          </div>
        </div> */}
      </div>
      <div className="barBiru"></div>
    </>
  )
}
