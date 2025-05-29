import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {

    const { register, handleSubmit, formState:
        { errors }
    } = useForm();
    const { signup, isAuthenticated, errors: registerErrors } = useAuth();
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) navigate("/")
    }, [isAuthenticated])


    const onSubmit = handleSubmit(async (values) => {
        
        signup(values)
    })

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
                <h1 className="text-2xl text-white">Register</h1>
                {
                    registerErrors.map((error, i) => (
                        <div className="bg-red-500 p-2 text-white my-2" key={i}>
                            {error}
                        </div>
                    ))
                }
                <form onSubmit={onSubmit}>
                    <input type="text" {...register("fullname", { required: true })}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Fullname"
                    />
                    {errors.fullname && <p className="text-red-500">fullname is required</p>}

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

                    <input type="url" {...register("rrss_1", { required: true })}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Your Social network link"
                    />
                    {errors.rrss_1 && <p className="text-red-500">Social network link is required</p>}

                    <button type="submit">
                        Register
                    </button>
                </form>
                <p className="flex gap-x-2 justify-between text-white mt-4">Already have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
            </div>
        </div>










    )
}

export default RegisterPage;