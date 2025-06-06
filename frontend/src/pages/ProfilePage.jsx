import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

function ProfilePage() {
  const location = useLocation();
  const [mensaje_error, setMensaje] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const {
    user,
    updateUser,
    errors: profileErrors,
    successes: profileSuccess,
  } = useAuth();

  useEffect(() => {
    if (user) {
      setValue("fullname", user.fullname);
      setValue("email", user.email);
      setValue("password", "");
      setValue("identidad", user.identidad || "");
      setValue("dni", user.dni || "");
      setValue("cuenta_bancaria", user.cuenta_bancaria || "");
      setValue("rrss_1", user.rrss_1 || "");
      setValue("rrss_2", user.rrss_2 || "");
      setValue("rrss_3", user.rrss_3 || "");
    }
  }, [user, setValue]);

  useEffect(() => {
    if (location.state?.message && user.completado !== true) {
      setMensaje(location.state.message);

      const timer = setTimeout(() => {
        setMensaje(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [location.state, user]);

  const onSubmit = async (data) => {
    if (!data.password) {
      data.password = user.password;
    }

    try {
      await updateUser(data);
      // navigate("/profile");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div>
      {mensaje_error && (
        <div className="bg-red-500 text-black p-4 rounded mb-6 text-center">
          {mensaje_error}
        </div>
      )}

      <div className="aside">
        <div className="flex flex-col items-center justify-center bg-zinc-900 text-white space-y-4 p-4">
          <div className="bg-zinc-800 max-w-md w-full p-8 rounded-md shadow-md m-2">
            <h2 className="text-2xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse">
              Welcome, {user.fullname}!
            </h2>
            {profileErrors.map((error, i) => (
              <div className="bg-red-500 p-2 text-white my-2" key={i}>
                {error}
              </div>
            ))}
            {profileSuccess.map((success, i) => (
              <div className="bg-green-500 p-2 text-white my-2" key={i}>
                {success}
              </div>
            ))}
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                {...register("fullname", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder="Fullname"
              />
              {errors.fullname && (
                <p className="text-red-500">fullname is required</p>
              )}

              <input
                type="email"
                {...register("email", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder="Email" readOnly
              />
              {errors.email && (
                <p className="text-red-500">Email is required</p>
              )}
              <input
                type="password"
                {...register("password")}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder="Password"
              />
              {/* {errors.password && <p className="text-red-500">Password is required</p>} */}
              <input
                type="url"
                {...register("rrss_1", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder="Your Social network link"
              />
              {errors.rrss_1 && <p className="text-red-500">Social network is required</p>}
              <input
                type="url"
                {...register("rrss_2")}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder="Your Social network link (Optional)"
              />
              <input
                type="url"
                {...register("rrss_3")}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder="Your Social network link (Optional)"
              />

              <h2>Bank details</h2>
              <input
                type="text"
                {...register("identidad", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder="Bank name"
              />
              {errors.identidad && (
                <p className="text-red-500">Bank name is required</p>
              )}
              <input
                type="text"
                {...register("dni", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder="DNI"
              />
              {errors.dni && <p className="text-red-500">DNI is required</p>}
              <input
                type="text"
                {...register("cuenta_bancaria", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder="IBAN"
              />
              {errors.cuenta_bancaria && (
                <p className="text-red-500">IBAN is required</p>
              )}

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md my-2"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
