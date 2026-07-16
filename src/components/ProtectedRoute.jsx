import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ role = 'user', capability, children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user || user.role !== role) {
    const loginPath = role === 'admin' ? '/admin/login' : '/login'
    return <Navigate to={loginPath} state={{ from: location.pathname }} replace />
  }

  if (capability === 'auction' && user.subscriptionStatus !== 'active') {
    return <Navigate to="/auction/payment" replace />
  }

  return children
}
