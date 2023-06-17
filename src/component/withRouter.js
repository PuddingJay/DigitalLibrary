import { useNavigate } from 'react-router-dom'

export const withRouter = (Component) => {
  const Wrapper = (props) => {
    const navigate = useNavigate()

    // eslint-disable-next-line react/react-in-jsx-scope
    return <Component navigate={navigate} {...props} />
  }

  return Wrapper
}
