import React, { Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react-pro'

// routes config
import routes from '../routes'
import AppBreadcrumb from './AppBreadcrumb'
import axios from 'axios'
import jwtDecode from 'jwt-decode'

const AppContent = () => {
  // const [, setToken] = useState('')
  const [setExpire] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    refreshToken()
    // getAdmin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')

      // Check if refreshToken is null
      if (!refreshToken) {
        throw new Error('Refresh token not found')
      }

      const response = await axios.get(`http://localhost:3005/token/${refreshToken}`)
      localStorage.setItem('refreshToken', refreshToken)
      const decoded = jwtDecode(response.data.accessToken)
      setExpire(decoded.exp)
      console.log(decoded)
    } catch (err) {
      console.log(err.message)
      // if (err.message === 'Refresh token not found') {
      //   '
      // } else if (err.response && err.response.status === 401) {
      //   // navigate('/login')
      //   window.location.href = '/login'
      // }
      // console.log(err)
    }
    // finally {
    //   try {
    //     await axios.delete('http://localhost:3005/siswaLogout')
    //   } catch (err) {
    //     console.log(err.message)
    //   }
    // }
  }

  return (
    <CContainer lg>
      <AppBreadcrumb />
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
