// src/VistaPrevia.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function VistaPrevia() {
  const [secciones, setSecciones] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/secciones')
      .then(res => setSecciones(res.data))
      .catch(err => console.error(err));
  }, []);

  const buildTree = (items, parentId = null) => {
    return items
      .filter(item => item.id_padre === parentId)
      .sort((a, b) => a.orden - b.orden)
      .map(item => ({
        ...item,
        children: buildTree(items, item.id)
      }));
  };

  const renderTree = (nodes) => {
    return nodes.map(node => (
      <div key={node.id} style={{ marginLeft: getMargin(node.tipo), marginBottom: '1rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>{`${node.numero} ${node.titulo}`}</h2>
        <div dangerouslySetInnerHTML={{ __html: node.contenido }} />
        {node.children.length > 0 && renderTree(node.children)}
      </div>
    ));
  };

  const getMargin = (tipo) => {
    switch (tipo) {
      case 'capitulo': return 0;
      case 'seccion': return 20;
      case 'subseccion': return 40;
      default: return 60;
    }
  };

  const rootTree = buildTree(secciones);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Vista previa del documento</h1>
      <Link to="/">← Volver al editor</Link>
      <hr style={{ marginBottom: '2rem' }} />
      {renderTree(rootTree)}
    </div>
  );
}

export default VistaPrevia;
