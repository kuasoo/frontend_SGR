// components/AdminCrearUsuario.jsx
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; 

function AdminCrearUsuario() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('colaborador');


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      
      await axios.post('http://localhost:3001/api/usuarios/crear', {
        username,
        password,
        rol,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(`Usuario '${username}' creado con éxito.`); 
      
      
      setUsername('');
      setPassword('');
      setRol('colaborador');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al crear usuario';
      toast.error(errorMsg); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">Crear Nuevo Usuario</h2>
      
      <div className="space-y-3">
        <input 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          placeholder="Nombre de usuario" 
          required 
          className="input w-full p-2 border rounded" 
        />
        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Contraseña" 
          required 
          className="input w-full p-2 border rounded" 
        />
        <select 
          value={rol} 
          onChange={e => setRol(e.target.value)} 
          className="input w-full p-2 border rounded bg-white"
        >
          <option value="colaborador">Colaborador</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      {}

      <button 
        type="submit" 
        className="mt-4 bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Crear Usuario
      </button>
    </form>
  );
}

export default AdminCrearUsuario;