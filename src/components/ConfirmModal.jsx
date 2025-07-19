// src/components/ConfirmModal.jsx

import React from 'react';

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) {
    return null;
  }

  return (
    
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
      
      {/* Caja de diálogo */}
      <div style={{ background: 'white', padding: '25px', borderRadius: '8px', width: '400px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        
        <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>
          {message}
        </h3>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;