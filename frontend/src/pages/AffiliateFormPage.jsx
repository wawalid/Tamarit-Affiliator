import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAffiliateLinks } from "../context/Affiliate_linksContext";

function AffiliateFormPage() {
  const { user } = useAuth();
  console.log("user en AffiliateFormPage", user);
  const {
    register,
    handleSubmit,
    formState: { errors }, 
    formState: { Successes },
  } = useForm();

  const [utmLink, setUtmLink] = useState("");
  const {
  createAffiliateLink,
  errors: affiliate_linkErrors,
  successes: affiliate_linkSuccesses,
} = useAffiliateLinks();



  const onSubmit = async (data) => {
    const { nombre_campaña, enlace_original } = data;

    try {
      const baseUrl = new URL(enlace_original);
      baseUrl.searchParams.set("id_afiliado", user.id_afiliado);
      baseUrl.searchParams.set("utm_source", "Tamarit_Affiliator");
      baseUrl.searchParams.set("utm_campaign", nombre_campaña);

      const enlace_utm = baseUrl.toString();

      const affiliateLink = {
        nombre_enlace: nombre_campaña,
        enlace_original: enlace_original,
        enlace_utm,
        id_afiliado: user.id_afiliado,
      };

      const success = await createAffiliateLink(affiliateLink);
      if (success) {
        setUtmLink(enlace_utm);
      }
    } catch (error) {
      console.error("URL inválida:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-zinc-900 text-white space-y-4 p-4">
      <div className="bg-zinc-800 max-w-md w-full p-8 rounded-md shadow-md m-2">
        {errors.nombre_campaña && (
          <div className="bg-red-500 p-2 text-white my-2">
            El nombre de campaña es obligatorio.
          </div>
        )}
        {errors.enlace_original && (
          <div className="bg-red-500 p-2 text-white my-2">
            El enlace original es obligatorio.
          </div>
        )}
        {errors.codigo_descuento && (
          <div className="bg-red-500 p-2 text-white my-2">
            El código de descuento es obligatorio.
          </div>
        )}

        {affiliate_linkErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white my-2" key={i}>
            {error}
          </div>
        ))}
        {affiliate_linkSuccesses.map((success, i) => (
          <div className="bg-green-500 p-2 text-white my-2" key={i}>
            {success}
          </div>
        ))}

        <h1 className="text-xl font-bold mb-4 text-center">
          Generar Enlace de afiliado
        </h1>

        {user?.id_afiliado && (
          <div className="bg-green-700 text-white text-sm py-3 rounded-md mb-4 text-center">
            <p>
              <strong>Tu código de afiliado:</strong> {user.id_afiliado}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            {...register("nombre_campaña", { required: true })}
            placeholder="Nombre de campaña"
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          />

          <input
            type="url"
            {...register("enlace_original", { required: true })}
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
