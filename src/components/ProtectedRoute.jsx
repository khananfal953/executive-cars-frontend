import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const LOGIN_PATHS = {
  buyer:  '/login',
  admin:  '/admin/login',
  seller: '/login',
}

export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth()
  if (!user || user.role !== role) {
    return <Navigate to={LOGIN_PATHS[role] ?? '/'} replace />
  }
  return children
}
