import React from "react";
import "./adminLayout.scss";
import LeftBar from "../admin-left-bar/LeftBar";
import NavBar from "../admin-nav-bar/NavBar";
import { Outlet } from "react-router-dom";
export default function AdminLayout() {
  return (
    <>
      <NavBar />

      <div className="mainContainer">
        <LeftBar />
        <div className="outletContainer">
          <div className="outletContent">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
