import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

function AffiliateFormPage() {
  const { register, handleSubmit } = useForm();
  const [utmLink, setUtmLink] = useState("");

  const onSubmit = ({ nombre, enlace }) => {
    const baseUrl = new URL(enlace);
    baseUrl.searchParams.set("utm_source", "tamarit");
    baseUrl.searchParams.set("utm_medium", "walid_pruebas");
    baseUrl.searchParams.set("utm_campaign", nombre);

    setUtmLink(baseUrl.toString());
  };

  return (
    <div className="flex flex-col items-center justify-center bg-zinc-900 text-white">
      <div className="bg-zinc-800 max-w-md w-full p-8 rounded-md shadow-md">
        <h1 className="text-xl font-bold mb-4">Generar Enlace de afiliado</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            {...register("nombre", { required: true })}
            placeholder="Nombre de campaña"
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          />

          <input
            type="url"
            {...register("enlace", { required: true })}
            placeholder="Enlace original"
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md my-2"
          >
            Generar enlace
          </button>
        </form>

        {utmLink && (
          <div className="mt-4">
            <p className="font-semibold">Enlace generado:</p>
            <code className="text-sm break-words">{utmLink}</code>
          </div>
        )}
      </div>
    </div>
  );
}

export default AffiliateFormPage;
