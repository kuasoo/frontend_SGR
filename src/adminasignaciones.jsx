// src/AdminAsignaciones.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminAsignaciones() {
  const [usuarios, setUsuarios] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
  const [seccionSeleccionada, setSeccionSeleccionada] = useState('');

  useEffect(() => {
    cargarUsuarios();
    cargarSecciones();
    cargarAsignaciones();
  }, []);

  const cargarUsuarios = async () => {
    const res = await axios.get('http://localhost:3001/api/usuarios');
    setUsuarios(res.data);
  };

  const cargarSecciones = async () => {
    const res = await axios.get('http://localhost:3001/api/secciones');
    setSecciones(res.data);
  };

  const cargarAsignaciones = async () => {
    const res = await axios.get('http://localhost:3001/api/asignaciones');
    setAsignaciones(res.data);
  };

  const handleAsignar = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/asignaciones', {
        usuario_id: usuarioSeleccionado,
        seccion_id: seccionSeleccionada
      });
      alert('Asignado correctamente');
      cargarAsignaciones();
    } catch (err) {
      alert('Error al asignar');
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Eliminar esta asignación?')) {
      await axios.delete(`http://localhost:3001/api/asignaciones/${id}`);
      cargarAsignaciones();
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Asignación de secciones a colaboradores</h2>
      <form onSubmit={handleAsignar} style={{ marginBottom: '1rem' }}>
        <select value={usuarioSeleccionado} onChange={(e) => setUsuarioSeleccionado(e.target.value)} required>
          <option value=''>Selecciona un usuario</option>
          {usuarios.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
        </select>

        <select value={seccionSeleccionada} onChange={(e) => setSeccionSeleccionada(e.target.value)} required>
          <option value=''>Selecciona una sección</option>
          {secciones.map(s => <option key={s.id} value={s.id}>{s.numero} {s.titulo}</option>)}
        </select>

        <button type='submit'>Asignar</button>
      </form>

      <h3>Asignaciones actuales</h3>
      <ul>
        {asignaciones.map(a => (
          <li key={a.id}>
            {a.username} - {a.titulo}
            <button onClick={() => handleEliminar(a.id)} style={{ marginLeft: '1rem', color: 'red' }}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminAsignaciones;
