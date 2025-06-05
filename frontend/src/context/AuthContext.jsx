import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import {
  registerRequest,
  loginRequest,
  logoutRequest,
  verifyTokenRequest,
  updateUserRequest,
} from "../api/auth";
import { getUsersRequest,getUserByIdRequest, updateVerifiedUserRequest } from "../api/users";
import { matchRequest } from "../api/admin";
import { getSystemInfoRequest } from "../api/system_info";


export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [affiliateUser, setAffiliateUser] = useState(null);
  const [errors, setErrors] = useState([]);
  const [successes, setSuccesses] = useState([]);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
      console.log("datos del usuario al registrarse", res.data);
    } catch (error) {
      console.log(error.response);
      setErrors(error.response.data);
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
      console.log("datos del usuario al iniciar sesion", res.data);
    } catch (error) {
      console.log(error.response);
      setErrors(error.response.data);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    logoutRequest()
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = async (user) => {
    try {
      const res = await updateUserRequest(user);
      setUser(res.data);
      setSuccesses(["Usuario actualizado correctamente"]);
      console.log("datos del usuario al actualizar", res.data);
    } catch (error) {
      console.log(error.response);
      setErrors(error.response.data);
    }
  };

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

  const getUserbyID = async (id) => {
    try {
      const res = await getUserByIdRequest(id);
      console.log(res.data);
      console.log("datos del usuario al obtener por ID", res.data);
      setAffiliateUser(res.data);
    } catch (error) {
      console.log(error);
      throw error; // Propagar el error para que el componente pueda manejarlo
    }
  };

  const toggleVerificado = async (id) => {
    try {
      const res = await updateVerifiedUserRequest(id);
      console.log(res.data);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, is_verified: !user.is_verified } : user
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const match = async (formData) => {
    try {
      const res = await matchRequest(formData);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      throw error; // Propagar el error para que el componente pueda manejarlo
    }
  };


  const getSystemInfo = async () => {
    try {
      const res = await getSystemInfoRequest();
      console.log("Información del sistema:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error al obtener información del sistema:", error);
      throw error;
    }
  };




  // Borrar los mensajes de error y éxito después de 5 segundos
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    if (successes.length > 0) {
      const timer = setTimeout(() => {
        setSuccesses([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successes]);


  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await verifyTokenRequest();
        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
        console.log("datos del usuario al verificar token", res.data);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    }

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        logout,
        updateUser,
        getUsers,
        getUserbyID,
        toggleVerificado,
        match,
        getSystemInfo,
        loading,
        user,
        affiliateUser,
        users,
        isAuthenticated,
        errors,
        successes
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
