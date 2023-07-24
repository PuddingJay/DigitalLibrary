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
  const [, setToken] = useState('')
  const [, setExpire] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    refreshToken()
    // getAdmin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:3005/siswa/token')
      setToken(response.data.accessToken)
      const decoded = jwtDecode(response.data.accessToken)
      setExpire(decoded.exp)
      console.log(decoded)
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/login')
      }
      console.log(err.message)
    }
  }

  // const getAdmin = async () => {
  //   const response = await axiosJWT.get('http://localhost:3005/admin', {
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
  //         const response = await axios.get('http://localhost:3005/token')
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
