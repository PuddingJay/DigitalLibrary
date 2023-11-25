import React from 'react'
import { CFooter } from '@coreui/react-pro'

const AppFooter = () => {
  return (
    <CFooter style={{ justifyContent: 'flex-start', padding: '20px 16px' }}>
      <div style={{ fontFamily: 'Poppins' }}>
        <span className="ms-1">Copyright &copy; 2023 Pengabdian Kepada Masyarakat </span>
        <a href="https://universitaspertamina.ac.id/" target="_blank" rel="noopener noreferrer">
          Universitas Pertamina
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
