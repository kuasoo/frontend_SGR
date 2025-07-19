import { useEffect, useState, useRef } from 'react';
const apiBase = import.meta.env.VITE_API_URL;
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import Login from './login';
import './app.css';
import { FaEdit, FaSave, FaTrash, FaPlus, FaEllipsisV, FaSyncAlt } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import AdminCrearUsuario from './components/AdminCrearUsuario';
import ModalCrearElemento from './components/ModalCrearElemento';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmModal from './components/ConfirmModal';
import AdminGestionarUsuarios from './components/AdminGestionarUsuarios';


// Imports de TinyMCE
import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/models/dom';
import 'tinymce/plugins/link';
import 'tinymce/plugins/table';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/code';
import 'tinymce/plugins/image';
import 'tinymce/plugins/media';
import 'tinymce/skins/ui/oxide/skin.min.css';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [secciones, setSecciones] = useState([]);
  const [contenidoSeleccionado, setContenidoSeleccionado] = useState(null);
  const [contenidoHTML, setContenidoHTML] = useState('');
  const [modalConfig, setModalConfig] = useState({ isOpen: false, tipo: null, padre: null });
  const [hayCambios, setHayCambios] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [confirmState, setConfirmState] = useState({ isOpen: false, message: '', onConfirm: () => {} });
  const [actualizando, setActualizando] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUsuario(JSON.parse(userData));
      cargarSecciones();
    }
    setCargando(false);
  }, []);

  const cargarSecciones = () => {
    setActualizando(true);
    const url = `${apiBase}/contenido?cacheBust=${new Date().getTime()}`;
    axios.get(url)
      .then(res => {
        setSecciones(res.data);
      })
      .catch(err => toast.error("Error al cargar el índice."))
      .finally(() => {
        setActualizando(false);
      });
  };

  const handleLogout = () => {
    localStorage.clear();
    setUsuario(null);
    setSecciones([]);
    setContenidoSeleccionado(null);
  };
  
  const handleSelect = (seccion) => {
    setContenidoSeleccionado(seccion);
    setContenidoHTML(seccion.contenido || '');
    setHayCambios(false);
  };

  const handleSave = () => {
    if (!contenidoSeleccionado || !hayCambios) return;
    let ruta = '';
    if (contenidoSeleccionado.tipo === 'seccion') {
        ruta = `${apiBase}/secciones/${contenidoSeleccionado.id}`;
    } else if (contenidoSeleccionado.tipo === 'subseccion') {
        ruta = `${apiBase}/subsecciones/${contenidoSeleccionado.id}`;
    } else {
        return;
    }

    axios.post(ruta, { contenido: contenidoHTML })
      .then(() => {
        toast.success('Contenido guardado');
        setHayCambios(false);
      })
      .catch(() => toast.error('Error al guardar contenido'));
  };

  const handleVistaPrevia = () => {
    const contenidoPlano = (nodos) => nodos.map(n => {
      const texto = `${n.numero || ''} ${n.titulo}\n${n.contenido?.replace(/<[^>]+>/g, '') || ''}`;
      const hijos = n.children ? contenidoPlano(n.children) : [];
      return [texto, ...hijos].join('\n\n');
    }).join('\n\n');
    const ventana = window.open('', '_blank');
    ventana.document.write(`<pre style="font-family: sans-serif; white-space: pre-wrap;">${contenidoPlano(secciones)}</pre>`);
  };

  const handleGenerarWord = () => {
    window.open(`${apiBase}/exportar-docx`, '_blank');
  };

  const abrirModal = (tipo, padre = null) => {
    setModalConfig({ isOpen: true, tipo, padre });
  };

  const cerrarModal = () => {
    setModalConfig({ isOpen: false, tipo: null, padre: null });
  };

  const handleCrearElemento = ({ titulo, parentId, tipo, orden }) => {
    const url = `${apiBase}/elementos`;
    
    const data = { 
      titulo, 
      tipo, 
      parentId,
      orden
    };
    
    axios.post(url, data)
      .then(() => {
        toast.success(`${tipo} creado con éxito`);
        cargarSecciones();
        cerrarModal();
      })
      .catch(err => {
        const errorMessage = err.response?.data?.error || `Hubo un error al crear el ${tipo}.`;
        toast.error(errorMessage);
      });
  };

  const handleDeleteItem = (node) => {
    setConfirmState({
      isOpen: true,
      message: `¿Seguro que quieres eliminar "${node.titulo}"?`,
      onConfirm: () => {
        let url = '';
        if (node.tipo === 'capitulo') url = `${apiBase}/capitulos/${node.id}`;
        else if (node.tipo === 'seccion') url = `${apiBase}/secciones/${node.id}`;
        else if (node.tipo === 'subseccion') url = `${apiBase}/subsecciones/${node.id}`;
        else return;
        
        axios.delete(url).then(() => {
          toast.success('Elemento eliminado');
          cargarSecciones();
          setContenidoSeleccionado(null);
        }).catch(() => toast.error('Error al eliminar.'));
        setConfirmState({ isOpen: false, message: '', onConfirm: () => {} });
      }
    });
  };

  const guardarTitulo = (node, nuevoTitulo, onFinish) => {
    let url = '';
    if (node.tipo === 'capitulo') url = `${apiBase}/capitulos/${node.id}/titulo`;
    else if (node.tipo === 'seccion') url = `${apiBase}/secciones/${node.id}/titulo`;
    else if (node.tipo === 'subseccion') url = `${apiBase}/subsecciones/${node.id}/titulo`;
    else return;
      
    axios.put(url, { titulo: nuevoTitulo })
      .then(() => {
        toast.success('Título actualizado');
        cargarSecciones();
        onFinish();
      }).catch(() => toast.error('Error al actualizar título.'));
  };

  const TreeNode = ({ node }) => {
    const [editando, setEditando] = useState(false);
    const [tituloEditado, setTituloEditado] = useState(node.titulo);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) setMenuAbierto(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const getTypographyClass = (tipo) => {
        if (tipo === 'capitulo') return 'font-bold text-base';
        if (tipo === 'seccion') return 'font-semibold text-sm';
        if (tipo === 'subseccion') return 'font-normal text-sm text-gray-600';
        return 'font-normal text-sm';
    };
    
    const isSelected = contenidoSeleccionado && contenidoSeleccionado.id === node.id;

    return (
      <li className={`pl-4 border-l-2 border-gray-300 rounded-md ${isSelected ? 'bg-blue-100' : ''}`}>
        <div className="relative flex items-center justify-between py-1 group">
          {editando ? (
            <div className="flex gap-1 w-full">
              <input type="text" value={tituloEditado} onChange={(e) => setTituloEditado(e.target.value)} className="border px-2 py-1 rounded text-sm w-full"/>
              <button onClick={() => guardarTitulo(node, tituloEditado, () => setEditando(false))} className="p-2 text-green-600"><FaSave size={18}/></button>
              <button onClick={() => setEditando(false)} className="p-2 text-gray-500"><MdCancel size={18}/></button>
            </div>
          ) : (
            <>
              <button onClick={() => handleSelect(node)} className="flex-grow text-left pr-2">
                <span className={getTypographyClass(node.tipo)}>
                  <span className="font-mono">{node.numero}</span> {node.titulo}
                </span>
              </button>
              <div className="relative" ref={menuRef}>
                <button onClick={() => setMenuAbierto(!menuAbierto)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200">
                  <FaEllipsisV />
                </button>
                {menuAbierto && (
                  <div className=" mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                    <ul className="py-1">
                      {node.tipo === 'capitulo' && <li onClick={() => { abrirModal('Sección', node); setMenuAbierto(false); }} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Añadir Sección</li>}
                      {node.tipo === 'seccion' && <li onClick={() => { abrirModal('Subsección', node); setMenuAbierto(false); }} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Añadir Subsección</li>}
                      <li onClick={() => { setEditando(true); setMenuAbierto(false); }} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Editar Título</li>
                      <li onClick={() => { handleDeleteItem(node); setMenuAbierto(false); }} className="px-4 py-2 text-sm text-red-700 hover:bg-red-50 cursor-pointer">Eliminar</li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {node.children && node.children.length > 0 && (
          <ul className="ml-2">
            {node.children.map(child => <TreeNode key={child.id} node={child} />)}
          </ul>
        )}
      </li>
    );
  };

  if (cargando) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><h2>Cargando...</h2></div>;
  }

  if (!usuario) {
    return <Login onLogin={setUsuario} />;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000}/>
      <div className="topbar">
        <div className="topbar-content">
          <div className="topbar-left">
            <img src="/imagenes/TECNM-ITESG AZUL_Mesa de trabajo 1.png" alt="Logo" className="topbar-logo" />
            <span className="topbar-title">Sistema de Reportes Trimestrales</span>
          </div>
          <div className="topbar-right">
            <div className="topbar-user">
              <img src="/imagenes/icon_user.png" alt="Usuario" className="user-avatar" />
              <span className="user-name">{usuario?.username}</span>
            </div>
            <div className="topbar-buttons">
              <button onClick={handleVistaPrevia} className="bg-blue-500 text-white px-3 py-2 rounded">Vista previa</button>
              <button onClick={handleGenerarWord} className="bg-green-500 text-white px-3 py-2 rounded">Generar Documento</button>
              <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-2 rounded">Cerrar sesión</button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        {}
        {usuario?.rol === 'admin' && ( 
          <div className="my-8 p-4 bg-gray-100 rounded-lg shadow-inner">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Panel de Administrador</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Columna 1: Crear Usuario */}
              <AdminCrearUsuario />
              {/* Columna 2: Gestionar Usuarios */}
              <AdminGestionarUsuarios />
            </div>
          </div> 
        )}

        <div className="flex gap-6">
          <div className="flex flex-col w-1/3 pr-4 border-r border-gray-200" style={{maxHeight: 'calc(100vh - 120px)'}}>
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">Índice</h2>
                <button onClick={cargarSecciones} title="Actualizar índice" className="p-2 text-gray-500 hover:text-blue-600" disabled={actualizando}>
                  <FaSyncAlt className={actualizando ? 'animate-spin' : ''} />
                </button>
              </div>
              <button onClick={() => abrirModal('Capítulo')} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-1 px-3 rounded" title="Agregar nuevo capítulo">
                + Capítulo
              </button>
            </div>
            <div className="flex-grow overflow-y-auto">
              <ul className="space-y-1">
                {secciones.map((node, index) => <TreeNode key={node.id} node={node} />)}
              </ul>
            </div>
          </div>
          <div className="w-2/3">
            {contenidoSeleccionado ? (
              <>
                <h2 className="text-xl font-semibold mb-2">Editar: {contenidoSeleccionado.titulo}</h2>
                <Editor
                  value={contenidoHTML}
                  onEditorChange={(content) => { setContenidoHTML(content); setHayCambios(true); }}
                  init={{ license_key: 'gpl', height: 400, menubar: false, plugins: ['link', 'table', 'lists', 'code', 'image', 'media'], toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image table code', content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }' }}
                />
                <div className="save-button mt-4">
                  <button onClick={handleSave} disabled={!hayCambios} className={`px-4 py-2 rounded text-white font-semibold ${!hayCambios ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    Guardar Cambios
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Selecciona un elemento del índice para comenzar a editar.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmModal 
        isOpen={confirmState.isOpen}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState({ isOpen: false, message: '', onConfirm: () => {} })}
      />
      <ModalCrearElemento 
        config={modalConfig}
        onClose={cerrarModal}
        onSubmit={({ titulo, orden }) => handleCrearElemento({ titulo, orden, parentId: modalConfig.padre?.id, tipo: modalConfig.tipo })}
      />
    </>
  );
}

export default App;