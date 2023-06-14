import React from 'react'
import {
  CBadge,
  CButton,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CProgress,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilList } from '@coreui/icons'

const AppHeaderDropdownTasks = () => {
  const itemsCount = 5
  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle caret={false}>
        <span className="d-inline-block my-1 mx-2 position-relative">
          <CIcon icon={cilList} size="lg" />
          <CBadge color="danger" position="top-end" shape="rounded-circle" className="p-1">
            <span className="visually-hidden">{itemsCount} new alerts</span>
          </CBadge>
        </span>
      </CDropdownToggle>
      <CDropdownMenu placement="bottom-end" className="pt-0">
        <CDropdownHeader className="bg-body-secondary rounded-top">
          <strong>You have {itemsCount} pending tasks</strong>
        </CDropdownHeader>
        <CDropdownItem className="d-block">
          <div className="small mb-1">
            Upgrade NPM &amp; Bower{' '}
            <span className="float-end">
              <strong>0%</strong>
            </span>
          </div>
          <CProgress thin color="info-gradient" value={0} />
        </CDropdownItem>
        <CDropdownItem className="d-block">
          <div className="small mb-1">
            ReactJS Version{' '}
            <span className="float-end">
              <strong>25%</strong>
            </span>
          </div>
          <CProgress thin color="danger-gradient" value={25} />
        </CDropdownItem>
        <CDropdownItem className="d-block">
          <div className="small mb-1">
            VueJS Version{' '}
            <span className="float-end">
              <strong>50%</strong>
            </span>
          </div>
          <CProgress thin color="warning-gradient" value={50} />
        </CDropdownItem>
        <CDropdownItem className="d-block">
          <div className="small mb-1">
            Add new layouts{' '}
            <span className="float-end">
              <strong>75%</strong>
            </span>
          </div>
          <CProgress thin color="info-gradient" value={75} />
        </CDropdownItem>
        <CDropdownItem className="d-block">
          <div className="small mb-1">
            Angular 2 Cli Version{' '}
            <span className="float-end">
              <strong>100%</strong>
            </span>
          </div>
          <CProgress thin color="success-gradient" value={100} />
        </CDropdownItem>
        <div className="p-2">
          <CButton color="primary" variant="outline" className="w-100">
            View all tasks
          </CButton>
        </div>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdownTasks
