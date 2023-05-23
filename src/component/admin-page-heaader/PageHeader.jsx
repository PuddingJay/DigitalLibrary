import React from 'react'
import './pageHeader.scss'
// import '../../style.scss'
import { CCard } from '@coreui/react'

export const PageHeader = ({ title, icon }) => {

  return (
    <div className="paper">
      <div className="pageHeader">
        <CCard>
          {icon}
        </CCard>
        <div className='pageHeaderTitle'>
          <h2>{title}</h2>
        </div>
      </div>
    </div>
  )
}
