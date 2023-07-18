import React from 'react'
import { CFooter } from '@coreui/react-pro'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <span className="ms-1">Colaborated With </span>
        <a href="https://universitaspertamina.ac.id/" target="_blank" rel="noopener noreferrer">
          Universitas Pertamina
        </a>
        <span className="ms-1">&copy; 2023 PKM UPer</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
