import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAffiliateLinks } from "../context/Affiliate_linksContext";

function AffiliateFormPage() {
  const { user } = useAuth();
  const { register, handleSubmit } = useForm();
  const [utmLink, setUtmLink] = useState("");
  const { createAffiliateLink } = useAffiliateLinks();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const { nombre_campaña, enlace_original, codigo_descuento } = data;

    try {
      const baseUrl = new URL(enlace_original);
      baseUrl.searchParams.set("utm_medium", "walid_pruebas");
      baseUrl.searchParams.set("utm_username", user.username);
      baseUrl.searchParams.set("utm_source", "Tamarit_Affiliator");
      baseUrl.searchParams.set("utm_campaign", nombre_campaña);

      const enlace_utm = baseUrl.toString();
      setUtmLink(enlace_utm);

      const affiliateLink = {
        nombre_enlace: nombre_campaña,
        enlace_original: enlace_original,
        enlace_utm,
        codigo_descuento,
      };

      createAffiliateLink(affiliateLink);
      // navigate("/my-affiliates");
    } catch (error) {
      console.error("URL inválida:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-zinc-900 text-white min-h-screen">
      <div className="bg-zinc-800 max-w-md w-full p-8 rounded-md shadow-md">
        <h1 className="text-xl font-bold mb-4">Generar Enlace de afiliado</h1>
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

          <input
            type="text"
            {...register("codigo_descuento", { required: true })}
            placeholder="Código de descuento"
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
