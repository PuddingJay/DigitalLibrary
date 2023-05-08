import React from 'react'
import './adminLayout.scss'
import LeftBar from '../left-bar/LeftBar'
import NavBar from '../nav-bar/NavBar'
import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <>
      <NavBar />
      <div className="barBiru"></div>
      <div className="mainContainer">
        <LeftBar />
        <div className="outletContainer">
          <div className="outletContent">
            <Outlet />
          </div>
        </div>

      </div>
    </>
  )
}
