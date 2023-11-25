import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { CSpinner } from '@coreui/react-pro'
import './scss/style.scss'
import Kategori from './views/admin/admin-daftarpustaka/Kategori'

const loading = (
  <div className="pt-3 text-center">
    <CSpinner color="primary" variant="grow" />
  </div>
)

const getPreferredTheme = (storedTheme) => {
  if (storedTheme) {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const setTheme = (theme) => {
  document.documentElement.dataset.coreuiTheme =
    theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : theme
}

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Home = React.lazy(() => import('./views/user/Home/Home'))
const Detail = React.lazy(() => import('./views/user/Detail/Detail'))
const PdfRead = React.lazy(() => import('./views/user/PdfRead'))
const UpdateSiswa = React.lazy(() => import('./views/user/UpdateSiswa/UpdateSiswa'))
const SiswaLogin = React.lazy(() => import('./views/user/LoginSiswa/LoginSiswa'))
const ShowPdf = React.lazy(() => import('./views/admin/admin-daftarpustaka/ShowPdf'))
const FormPengunjung = React.lazy(() =>
  import('./views/pages/form-data-pengunjung/FormDataPengunjung'),
)
const App = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.theme)
  const urlParams = new URLSearchParams(window.location.href.split('?')[1])

  useEffect(() => {
    if (urlParams.get('theme')) {
      dispatch({ type: 'setTheme', theme: urlParams.get('theme') })
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (theme !== 'light' || theme !== 'dark') {
        setTheme(getPreferredTheme(theme))
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setTheme(getPreferredTheme(theme))
  }, [theme])

  return (
    <BrowserRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route path="/login" name="Login Page" element={<Login />} />
          <Route path="/siswa/login" name="Login" element={<SiswaLogin />} />
          <Route exact path="/" name="Login Page" element={<SiswaLogin />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route
            exact
            path="/form-pengunjung"
            name="Form Pengunjung"
            element={<FormPengunjung />}
          />
          <Route path="*" name="Home" element={<DefaultLayout />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route exact path="/Home" name="Katalog Buku" element={<Home />} />
          <Route exact path="/Detail/:id" name="Detail Buku" element={<Detail />} />
          <Route exact path="/Kategori" name="Kategori Buku" element={<Kategori />} />
          <Route exact path="/PdfRead/:id" name="Baca Buku" element={<PdfRead />} />
          <Route exact path="/ShowPdf/:id" name="Lihat Buku" element={<ShowPdf />} />
          <Route exact path="/updateSiswa" name="Lihat Buku" element={<UpdateSiswa />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
