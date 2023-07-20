import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler, CImage } from '@coreui/react-pro'
import { AppSidebarNav } from '../AppSidebarNav'
import logo from '../../assets/logoSMA.png'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import './appSidebar.scss'

// sidebar nav config
import navigation from '../../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      colorScheme="light"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <img
          className="sidebar-brand-narrow"
          src={logo}
          height={35}
          alt="Logo SMA Yuppentek 1 Kota Tangerang"
        />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <img
            className="sidebar-brand-full ms-2"
            src={logo}
            height={35}
            alt="Logo SMA Yuppentek 1 Kota Tangerang"
          />
          <h5
            className="sidebar-brand-full ms-2"
            style={{
              margin: 'auto 10px',
              fontFamily: 'Poppins',
              fontWeight: 'bold',
              fontSize: '18px',
              letterSpacing: '0.5px',
            }}
          >
            SMA YUPPENTEK 1
          </h5>
        </div>
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CImage className="logo" fluid rounded src="/images/logouper.png" />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
