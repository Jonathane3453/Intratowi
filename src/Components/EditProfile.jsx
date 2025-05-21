import { useState } from "react";

const EditProfile = ({ setView, currentUser, setCurrentUser }) => {
  const [userData, setUserData] = useState(currentUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        setError("Por favor selecciona un archivo de imagen válido");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setError("La imagen debe ser menor a 2MB");
        return;
      }

      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.name || !userData.email) {
      setError("Nombre y correo electrónico son obligatorios");
      return;
    }
  if (!userData.id) {
    setError('ID de usuario no encontrado');
    return;
  }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:8080/actualizar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el perfil");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Error al guardar los cambios");
      }

      // Actualiza el estado global del usuario
      setCurrentUser(userData);
      setSuccess(true);
      setTimeout(() => {
        setView("profile");
      }, 1500);
    } catch (err) {
      console.error("Error al guardar:", err);
      setError(err.message || "Ocurrió un error al guardar los cambios");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start w-full min-h-screen bg-gray-50 py-12 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Editar Perfil
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            ¡Cambios guardados exitosamente!
          </div>
        )}

        <div className="flex flex-col items-center">
          <img
            src={userData.photo}
            alt="Foto de perfil"
            className="w-32 h-32 rounded-full mb-4 border-4 border-blue-500 shadow"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="text-sm"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries({
            name: "Nombre",
            email: "Correo",
            phone: "Teléfono",
            department: "Departamento",
            location: "Ubicación",
          }).map(([key, label]) => (
            <label key={key} className="flex flex-col">
              {label}
              <input
                name={key}
                value={userData[key]}
                onChange={handleChange}
                className="border rounded p-2"
                disabled={loading}
              />
            </label>
          ))}

          <label className="flex flex-col">
            Rol
            <select
              name="role"
              value={userData.role}
              onChange={handleChange}
              className="border rounded p-2"
              disabled={loading}
            >
              <option value="Activo">Administrador</option>
              <option value="Inactivo">Usuario</option>
            </select>
          </label>

          <label className="flex flex-col">
            Estado
            <select
              name="status"
              value={userData.status}
              onChange={handleChange}
              className="border rounded p-2"
              disabled={loading}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </label>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => setView("profile")}
            className="bg-gray-300 hover:bg-gray-400 text-black-700 font-semibold py-2 px-6 rounded-xl shadow cursor-pointer disabled:opacity-50"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-xl shadow cursor-pointer disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
