import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";


function LoginPage() {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const {user, signin, isAuthenticated, errors: signinErrors } = useAuth();
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) navigate("/")
    }, [isAuthenticated])

    const onSubmit = handleSubmit((data) => {
        signin(data)
    })
    

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
                {
                    signinErrors.map((error, i) => (
                        <div className="bg-red-500 p-2 text-white my-2" key={i}>
                            {error}
                        </div>
                    ))
                }
                {/* <h1 className="text-2xl text-white">Login</h1> */}
                <img src="../../media/tmrt-logo_480_prueba.png" alt="" className="" />
                <form onSubmit={onSubmit}>
                    <input type="email" {...register("email", { required: true })}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Email"
                    />
                    {errors.email && <p className="text-red-500">Email is required</p>}

                    <input type="password" {...register("password", { required: true })}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Password"
                    />
                    {errors.password && <p className="text-red-500">Password is required</p>}


                    <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md my-2 hover:bg-blue-600 transition-colors">
                        Login
                    </button>
                </form>
                <p className="flex gap-x-2 justify-between text-white mt-4">Don't have an account? <Link to="/register" className="text-blue-500">Register</Link></p>
            </div>
        </div>
    )
}

export default LoginPage;