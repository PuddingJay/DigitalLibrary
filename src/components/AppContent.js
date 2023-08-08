import React, { Suspense, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react-pro'

// routes config
import routes from '../routes'
import AppBreadcrumb from './AppBreadcrumb'
import axios from 'axios'
import jwtDecode from 'jwt-decode'

const AppContent = () => {
  // const [, setToken] = useState('')
  // const [expire, setExpire] = useState('')
  useEffect(() => {
    refreshToken()
    // getAdmin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('Refresh token not found')
      }

      const response = await axios.get(`http://localhost:3005/token/${refreshToken}`)
      localStorage.setItem('refreshToken', refreshToken)
      const decoded = jwtDecode(response.data.accessToken)

      const oneDayInMilliseconds = 24 * 60 * 60 * 1000
      const tokenExpirationTime = decoded.exp * 1000
      const currentTime = Date.now()
      if (currentTime > tokenExpirationTime + oneDayInMilliseconds) {
        localStorage.removeItem('refreshToken')
        throw new Error('Refresh token has expired')
      }

      console.log(decoded)
    } catch (err) {
      if (
        err.message === 'Refresh token not found' ||
        err.message === 'Refresh token has expired' ||
        (err.response && err.response.status === 403)
      ) {
        window.location.href = '/login'
      } else if (err.response && err.response.status === 401) {
        window.location.href = '/login'
      } else if (err.response && err.response.status === 403) {
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
      }
      console.log(err)
    }
    // finally {
    //   try {
    //     const refreshTokenSiswa = localStorage.getItem('refreshTokenSiswa')
    //     await axios.delete(`http://localhost:3005/siswaLogout/${refreshTokenSiswa}`)
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
