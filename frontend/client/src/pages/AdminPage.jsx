import React from "react";

// creare una funcion en el back que recuepre todos los usuarios y todos los enlaces de afiliados
// tendre que crear un nuevo endpoint en el back para eso
// el endpoint sera /api/admin o algo asi y sera un get
// el endpoint tendra que ser protegido por el middleware de admin
// el middleware comprobara si soy admin o no
// la funcion primero vera si soy admin
// si no soy admin no hara nada devolvera un array vacio o un error
// si lo soy devolvera todos los usuarios y todos los enlaces de afiliados
// llamare a ese endpoint desde el front usando axios
// creare una nueva funcion que se almacenara en el contexto de auth o podria tambien crear un nuevo contexto para admin aunque no es necesario
// y lo guardare en el contexto de auth lo llamare users o usuarios
// luego en el admin page hare un map a los usuarios y los enlaces y los mostrare en sus respectivas cards
// quiero que de los usuarios haya un boton que sea un switch para activar o desactivar el usuario, como se hace eso? dame el comentario entero


function AdminPage({ users = [], affiliate_links = [] }) {
  return (
    <div className="p-8">
      <h1 className="text-center text-2xl font-bold mb-8">Admin Page</h1>
      <div className="flex flex-wrap justify-center gap-6">
        {/* Administrar usuarios */}
        <div className="bg-zinc-800 w-80 p-8 rounded-md flex flex-col items-center justify-center shadow-lg">
          <h2 className="text-white text-lg mb-4">Administrar usuarios</h2>
          {users.length === 0 ? (
            <p className="text-white">No users available</p>
          ) : (
            <ul className="text-white list-disc list-inside">
              {users.map((user, index) => (
                <li key={index}>{user.name}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Administrar afiliados */}
        <div className="bg-zinc-800 w-80 p-8 rounded-md flex flex-col items-center justify-center shadow-lg">
          <h2 className="text-white text-lg mb-4">Administrar afiliados</h2>
          {affiliate_links.length === 0 ? (
            <p className="text-white">No links available</p>
          ) : (
            <ul className="text-white list-disc list-inside">
              {affiliate_links.map((link, index) => (
                <li key={index}>{link.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
