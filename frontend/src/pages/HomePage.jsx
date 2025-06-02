import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LandingPage() {
  const { user } = useAuth();

  let destination = "/login"; // por defecto

  if (user) {
    if (user.is_admin) {
      destination = "/admin_page";
    } else if (user.is_verified) {
      destination = "/create-affiliate-link";
    }
  }
  return (
    <div className="min-h-screen bg-[#202020] text-white font-sans">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Gana dinero con Tamarit Affiliator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Promociona nuestros productos y recibe comisiones por cada venta
            generada desde tus enlaces.
          </p>
          <Link
            to={destination}
            className="mt-6 inline-block bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition"
          >
            Únete ahora
          </Link>
        </section>

        {/* Cómo funciona */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-center">
            ¿Cómo funciona?
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl mb-2">🔗</div>
              <h3 className="font-bold mb-2">Genera tu enlace</h3>
              <p className="text-gray-300">
                Recibe un enlace único con tu código de afiliado.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">👀</div>
              <h3 className="font-bold mb-2">Trae visitas</h3>
              <p className="text-gray-300">
                Comparte el enlace y capta tráfico cualificado.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">🛒</div>
              <h3 className="font-bold mb-2">Conviertes en ventas</h3>
              <p className="text-gray-300">
                Cuando compran, asociamos la IP al pedido.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">💸</div>
              <h3 className="font-bold mb-2">Ganas comisión</h3>
              <p className="text-gray-300">
                Recibes pagos por cada conversión válida.
              </p>
            </div>
          </div>
        </section>

        {/* Normas */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-4 text-center">
            Normas y condiciones
          </h2>
          <ul className="list-disc list-inside max-w-3xl mx-auto text-gray-300 space-y-2">
            <li>No se permite el uso de SPAM ni métodos engañosos.</li>
            <li>
              Prohibido pujar por palabras clave de marca (SEM con "Tamarit").
            </li>
            <li>
              Las comisiones se validan semanalmente y se pagan mensualmente.
            </li>
            <li>El seguimiento se realiza mediante IPs y parámetros UTM.</li>
            <li>El fraude resultará en expulsión inmediata.</li>
          </ul>
        </section>

        {/* Actualizaciones */}
        <section className="mb-16 text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Actualización de datos
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            Las visitas y compras se sincronizan cada fin de semana. Las
            estadísticas y comisiones se actualizan automáticamente después de
            cada análisis.
          </p>
        </section>

        {/* Legal */}
        <section className="mb-8 text-center">
          <h2 className="text-3xl font-semibold mb-4">Legal y privacidad</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-2">
            Cumplimos con el RGPD. Los datos de IP y pedidos se usan únicamente
            para estadísticas y trazabilidad. No se comparten con terceros.
          </p>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Tamarit Motorcycles. Todos los derechos
            reservados.
          </p>
        </section>
      </div>
    </div>
  );
}

export default LandingPage;
