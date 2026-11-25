import { Link } from 'react-router'

function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <Link to="/">Back to the weekly rota</Link>
    </>
  )
}

export default NotFound
