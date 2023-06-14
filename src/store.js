import { createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  asideShow: false,
  theme: localStorage.getItem('coreui-pro-react-admin-template-theme-default') ?? 'light',
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'setTheme':
      const event = new Event('ColorSchemeChange')
      document.documentElement.dispatchEvent(event)
      localStorage.setItem('coreui-pro-react-admin-template-theme-default', rest.theme)
      return { ...state, ...rest }
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
