import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
// import { CImage } from '@coreui/react-pro'

const DefaultLayout = () => {
  // const linkUper = 'https://universitaspertamina.ac.id/'
  return (
    <>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        {/* <CImage href={linkUper} className="logo" fluid rounded src="/images/logouper.png" /> */}
        <AppFooter />
      </div>
    </>
  )
}

export default DefaultLayout
