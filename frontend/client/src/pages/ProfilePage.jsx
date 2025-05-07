import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { user, getUser, updateUser, errors: profileErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setValue("email", user.email);
      setValue("password", ""); // No autocompletar la contraseña por seguridad
      setValue("identidad", user.identidad || "");
      setValue("dni", user.dni || "");
      setValue("cuenta_bancaria", user.cuenta_bancaria || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    if (!data.password) {
      data.password = user.password; // Mantener la contraseña actual si no se proporciona una nueva
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
      {/* <h1>Profile Page</h1> */}
      <div className="aside">
        <div className="flex flex-col items-center justify-center bg-zinc-900 text-white">
          <div className="bg-zinc-800 max-w-md w-full p-8 rounded-md shadow-md">
            {profileErrors.map((error, i) => (
              <div className="bg-red-500 p-2 text-white my-2" key={i}>
                {error}
              </div>
            ))}
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                {...register("username", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder="Username"
              />
              {errors.username && (
                <p className="text-red-500">Username is required</p>
              )}

              <input
                type="email"
                {...register("email", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder="Email"
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
              <h2>Datos bancarios</h2>
              <input
                type="text"
                {...register("identidad", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder="Identidad"
              />
              {errors.identidad && (
                <p className="text-red-500">Identidad is required</p>
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
                placeholder="Cuenta bancaria"
              />
              {errors.cuenta_bancaria && (
                <p className="text-red-500">Cuenta bancaria is required</p>
              )}

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md my-2"
              >
                Guardar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
