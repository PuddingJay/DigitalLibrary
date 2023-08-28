import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilContrast, cilMenu, cilMoon, cilSun } from '@coreui/icons'

import { AppHeaderDropdown } from './header/index'

const AppHeader = () => {
  const dispatch = useDispatch()

  const sidebarShow = useSelector((state) => state.sidebarShow)
  const theme = useSelector((state) => state.theme)

  return (
    <CHeader position="sticky" className="bg-primary mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className={classNames('px-md-0 me-md-3 d-lg-none', {
            'prevent-hide': !sidebarShow,
          })}
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        {/* <CHeaderBrand className="mx-auto d-md-none text-white" to="/">
          <CIcon icon={logoNegative} height={34} alt="Logo" />
        </CHeaderBrand> */}
        <CHeaderNav className="d-none d-sm-flex ms-auto me-3">
          <li className="nav-item py-2 py-lg-1">
            <div className="vr h-100 mx-2 text-white text-opacity-50"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {theme === 'dark' ? (
                <CIcon icon={cilMoon} size="xl" />
              ) : theme === 'auto' ? (
                <CIcon icon={cilContrast} size="xl" />
              ) : (
                <CIcon icon={cilSun} size="xl" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={theme === 'light'}
                className="d-flex align-items-center"
                component="button"
                type="button"
                onClick={() => dispatch({ type: 'setTheme', theme: 'light' })}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={theme === 'dark'}
                className="d-flex align-items-center"
                component="button"
                type="button"
                onClick={() => dispatch({ type: 'setTheme', theme: 'dark' })}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={theme === 'auto'}
                className="d-flex align-items-center"
                component="button"
                type="button"
                onClick={() => dispatch({ type: 'setTheme', theme: 'auto' })}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-2 py-lg-1">
            <div className="vr h-100 mx-2 text-white text-opacity-50"></div>
          </li>
        </CHeaderNav>
        <CHeaderNav className="ms-auto ms-sm-0 me-sm-4">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
