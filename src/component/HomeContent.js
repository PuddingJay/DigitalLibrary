/* eslint-disable prettier/prettier */
import React, { Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react-pro'

// routes config
import routes from '../routes'
import AppBreadcrumb from '../components/AppBreadcrumb'
import axios from 'axios'
import jwtDecode from 'jwt-decode'

const AppContent = () => {
  const [, setExpire] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    refreshToken()
    // getAdmin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshTokenSiswa')

      if (!refreshToken) {
        throw new Error('Refresh token not found')
      }

      const response = await axios.get(
        `http://api2.librarysmayuppentek.sch.id/berhasilLogin/${refreshToken}`,
      )

      const decoded = jwtDecode(response.data.accessToken)
      localStorage.setItem('refreshTokenSiswa', refreshToken)
      setExpire(decoded.exp)
      console.log(decoded)
    } catch (err) {
      if (err.message === 'Refresh token not found') {
        navigate('/siswa/login')
      } else if (err.response && err.response.status === 401) {
        navigate('/siswa/login')
      }
      console.log(err)
    }
  }

  // const getAdmin = async () => {
  //   const response = await axiosJWT.get('https://api2.librarysmayuppentek.sch.id/admin', {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //   console.log(response.data)
  // }

  // const axiosJWT = axios.create()

  // axiosJWT.interceptors.request.use(
  //   async (config) => {
  //     const currentDate = new Date()
  //     if (expire * 1000 < currentDate.getTime()) {
  //       try {
  //         const response = await axios.get('https://api2.librarysmayuppentek.sch.id/token')
  //         config.headers.Authorization = `Bearer ${response.data.accessToken}`
  //         setToken(response.data.accessToken)
  //         const decoded = jwtDecode(response.data.accessToken)
  //         setExpire(decoded.exp)
  //       } catch (error) {
  //         console.log(error)
  //       }
  //     }
  //     return config
  //   },
  //   (error) => {
  //     return Promise.reject(error)
  //   },
  // )

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
                  name={route.Nama}
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
