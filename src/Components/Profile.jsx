import { useEffect, useState } from "react";

const Profile = ({ setView, currentUser, setCurrentUser }) => {
  const [loading, setLoading] = useState(!currentUser); // Solo carga si no hay usuario
  const [error, setError] = useState(null);

  useEffect(() => {
    // Solo hace fetch si no hay datos del usuario
    if (!currentUser) {
      const fetchUserData = async () => {
        try {
          const response = await fetch("http://localhost:8080/empleados");

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();

          if (!result.success) {
            throw new Error(result.message || "Error en la respuesta del servidor");
          }

          const userData = result.data || {
            name: "Usuario no encontrado",
            email: "",
            phone: "",
            department: "",
            role: "",
            location: "",
            joined: "",
            status: "Inactivo",
            photo: "data:image/png;base64,..."
          };
          
          setCurrentUser(userData);
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError(err.message);

          const defaultUser = {
            name: "Error al cargar datos",
            email: "contacto@empresa.com",
            phone: "+52 000 000 0000",
            department: "Soporte",
            role: "Usuario",
            location: "Oficina central",
            joined: new Date().toLocaleDateString("es-MX"),
            status: "Inactivo",
            photo: "data:image/png;base64,..."
          };
          
          setCurrentUser(defaultUser);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [currentUser, setCurrentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start w-full min-h-screen bg-gray-50 py-12 px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6">
        <div className="flex flex-col items-center">
          <img
            src={currentUser.photo}
            alt="Foto de perfil"
            className="w-32 h-32 rounded-full border-4 border-blue-500 mb-4 shadow"
          />
          <h2 className="text-2xl font-bold text-gray-800">{currentUser.name}</h2>
          <p className="text-gray-500">
            {currentUser.role} - {currentUser.department}
          </p>
          <span
            className={`mt-2 px-3 py-1 text-sm rounded-full ${
              currentUser.status === "Activo"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {currentUser.status}
          </span>
        </div>

        <div className="mt-6 space-y-3 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">Correo:</span>
            <span>{currentUser.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Teléfono:</span>
            <span>{currentUser.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Ubicación:</span>
            <span>{currentUser.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Fecha de ingreso:</span>
            <span>{currentUser.joined}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setView("editProfile")}
            className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-xl shadow cursor-pointer"
          >
            Editar perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;