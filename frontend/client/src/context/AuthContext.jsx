import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { registerRequest, loginRequest, verifyTokenRequest, updateUserRequest } from "../api/auth";
import { getUsersRequest, updateVerifiedUserRequest } from "../api/users";



export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([]);

    const signup = async (user) => {
        try {
            const res = await registerRequest(user)
            setUser(res.data)
            setIsAuthenticated(true)
            console.log("datos del usuario al registrarse", res.data)
        } catch (error) {
            console.log(error.response)
            setErrors(error.response.data)
        }
    }

    const signin = async (user) => {
        try {
            const res = await loginRequest(user)
            setUser(res.data)
            setIsAuthenticated(true)
            console.log("datos del usuario al iniciar sesion", res.data)
        } catch (error) {
            console.log(error.response)
            setErrors(error.response.data)
        }
    }

    const logout = () => {
        Cookies.remove("token")
        Cookies.remove("user")
        setIsAuthenticated(false)
        setUser(null)
    }

    
    const updateUser = async (user) => {
        try {
            const res = await updateUserRequest(user)
            setUser(res.data)
            console.log("datos del usuario al actualizar", res.data)
        } catch (error) {
            console.log(error.response)
            setErrors(error.response.data)
        }
    }


    // parametro puede ser un mismo usuario, un parametro de busqueda o cualquiera otra cosa, esto lo empezare a implementar para ahorrarme crear muchas funciones muy similares pero que hacen cosas distintas
    const getUsers = async (parametro = "") => {
        try {
          const res = await getUsersRequest(parametro);
          console.log(res.data);
          setUsers(res.data);
    
        } catch (error) {
          console.log(error);
        }
      };


      const toggleVerificado = async (id) => {
        try {
            const res = await updateVerifiedUserRequest(id);
            console.log(res.data);
            setUsers((prevUsers) =>
                prevUsers.map((user) => (user._id === id ? { ...user, is_verified: !user.is_verified } : user))
            );
        } catch (error) {
            console.log(error);
        }
    }
          



// Use effects
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([])
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [errors])

    useEffect(() => {
        async function checkLogin() {
            const cookies = Cookies.get()

            if (!cookies.token) {
                setIsAuthenticated(false)
                setLoading(false)
                return setUser(null)
            }
            try {
                const res = await verifyTokenRequest(cookies.token)
                if (!res.data) {
                    setIsAuthenticated(false)
                    setLoading(false)
                    return;
                }
                setIsAuthenticated(true)
                setUser(res.data)
                setLoading(false)
                console.log("datos del usuario al verificar token", res.data)
            } catch (error) {
                setIsAuthenticated(false)
                setUser(null)
                setLoading(false)
            }
        }

        checkLogin()
    }, [])
    
    return <AuthContext.Provider value={{ signup, signin, logout, updateUser, getUsers, toggleVerificado, loading, user,users, isAuthenticated, errors }}>
        {children}
    </AuthContext.Provider>

}