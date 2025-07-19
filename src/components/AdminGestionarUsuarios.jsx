// src/components/AdminGestionarUsuarios.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';

const AdminGestionarUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  
  const fetchUsers = () => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3001/api/usuarios', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUsuarios(res.data))
    .catch(() => toast.error("Error al cargar la lista de usuarios."));
  };

  
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEliminar = (userId, username) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar al usuario '${username}'?`)) {
        return;
    }
    
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3001/api/usuarios/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      toast.success(`Usuario '${username}' eliminado.`);
      
      fetchUsers(); 
    })
    .catch(err => {
      const errorMsg = err.response?.data?.error || "Error al eliminar el usuario.";
      toast.error(errorMsg);
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm mt-8">
      <h2 className="text-xl font-bold mb-4">Gestionar Usuarios</h2>
      <div className="max-h-60 overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Username</th>
              <th className="p-2">Rol</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(user => (
              <tr key={user.id} className="border-b">
                <td className="p-2">{user.id}</td>
                <td className="p-2 font-medium">{user.username}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${user.rol === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.rol}
                  </span>
                </td>
                <td className="p-2">
                  <button 
                    onClick={() => handleEliminar(user.id, user.username)}
                    className="text-red-500 hover:text-red-700"
                    title="Eliminar usuario"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminGestionarUsuarios;