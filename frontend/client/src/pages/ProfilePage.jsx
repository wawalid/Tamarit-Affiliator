import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const { register, handleSubmit, setValue } = useForm();
  const { user, getUser, updateUser } = useAuth(); // Asegúrate de tener una función updateUser en el contexto
  const navigate = useNavigate();

  // Autocompletar los datos del usuario al cargar la página
  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setValue("email", user.email);
      setValue("password", ""); // No autocompletes la contraseña por seguridad
      setValue("identidad", user.identidad || "");
      setValue("dni", user.dni || "");
      setValue("cuenta_bancaria", user.cuenta_bancaria || "");
    }
  }, [user, setValue]);

  // Manejar el envío del formulario
  const onSubmit = async (data) => {
    try {
      await updateUser(data); // Envía los datos actualizados al servidor
      navigate("/"); // Redirige a otra página después de guardar
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <div className="aside">
        <div>
          <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md flex flex-col align-content-center justify-center">
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                {...register("username", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder="Username"
              />
              <input
                type="email"
                {...register("email", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder="Email"
              />
              <input
                type="password"
                {...register("password")}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder="Password"
              />
              <h2>Datos bancarios</h2>
              <input
                type="text"
                {...register("identidad")}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder="Identidad"
              />
              <input
                type="text"
                {...register("dni")}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder="DNI"
              />
              <input
                type="text"
                {...register("cuenta_bancaria")}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder="Cuenta bancaria"
              />
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