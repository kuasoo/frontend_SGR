
import React, { useState, useEffect } from 'react';

const ModalCrearElemento = ({ config, onClose, onSubmit }) => {
  const [titulo, setTitulo] = useState('');
  
  const [orden, setOrden] = useState('');

  useEffect(() => {
    // Limpiar los campos cada vez que el modal se abre
    setTitulo('');
    setOrden('');
  }, [config.isOpen]);

  if (!config.isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (titulo) {
      
      onSubmit({ titulo, orden });
    }
  };



  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', padding: '25px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: 'bold' }}>{`Crear Nuevo ${config.tipo}`}</h2>
        <form onSubmit={handleSubmit}>
          {/* Campo para el Título */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="titulo" style={{ display: 'block', marginBottom: '5px' }}>Título del nuevo elemento:</label>
            <input id="titulo" type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required autoFocus style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}/>
          </div>
          
          {/* NUEVO CAMPO: Número de Orden (Opcional) */}
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="orden" style={{ display: 'block', marginBottom: '5px' }}>Posición / Orden (Opcional):</label>
            <input 
              id="orden" 
              type="number" 
              value={orden} 
              onChange={(e) => setOrden(e.target.value)} 
              placeholder="Dejar en blanco para añadir al final"
              min="1"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Crear</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearElemento;