import {useAuth} from './context/AuthContext'
import {Navigate, Outlet} from 'react-router-dom'
import {useEffect} from 'react'

function ProtectedRoute() {

    const {loading, isAuthenticated} = useAuth()
    console.log(loading, isAuthenticated)
    if (loading) {
        return <h1>Loading...</h1>
    }
    if (!loading && !isAuthenticated) {
        return <Navigate to="/login" replace={true} /> 
    }


    return <Outlet /> 
}
    
export default ProtectedRoute