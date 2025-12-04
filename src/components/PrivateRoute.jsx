import { Navigate } from "react-router-dom"

// private route component to protect authenticated routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken")

  // redirect to login if no token exists
  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute

