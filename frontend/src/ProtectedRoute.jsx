import {useAuth} from './context/AuthContext'
import {Navigate, Outlet} from 'react-router-dom'
import {useEffect} from 'react'

function Auth_ProtectedRoute() {

    const {loading, isAuthenticated, user} = useAuth()
    if (loading) {
        return <h1>Loading...</h1>
    }
    if (!loading && !isAuthenticated) {
        return <Navigate to="/login" replace={true} /> 
    }
    if (!loading && !user.is_verified) {
        return <Navigate to="/waiting-verification" replace={true} /> 
    }


    return <Outlet /> 
}
    
export default Auth_ProtectedRoute