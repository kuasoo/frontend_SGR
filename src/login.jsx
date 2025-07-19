import { useState } from 'react';
import axios from 'axios';
import './login.css';
const apiBase = import.meta.env.VITE_API_URL;
function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`${apiBase}/auth/login`, {
        username,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      console.error(err);
      setError('❌ Credenciales incorrectas');
    }
  };
<div className="topbar">
  <div className="topbar-content">
    <img src="/imagenes/TECNM-ITESG AZUL_Mesa de trabajo 1.png" alt="Logo" className="topbar-logo" />
    <span className="topbar-title">Sistema de Reportes Trimestrales</span>
  </div>
</div>

  return (
    
    <div className="login-wrapper">
      {/* Imagen de fondo difuminada */}
      <div className="login-background"></div>

      {/* Encabezado superior */}
      <header className="login-header">
        <img src="/imagenes/TECNM-ITESG AZUL_Mesa de trabajo 1.png" alt="Logo" className="login-logo" />
        <h1 className="login-title">Sistema de Generación de Reportes Trimestrales</h1>
      </header>

      <div className="login-container">
        <div className="login-card">
          <div className="login-left">
            <div className="login-icon">🔐</div>
            <h2>Bienvenido de nuevo</h2>
            <p>Accede a tu cuenta y continúa donde lo dejaste.</p>
          </div>

          <div className="login-right">
            <h2>Iniciar sesión</h2>
            <p className="subtitle">Ingresa tus credenciales para acceder</p>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit">Iniciar sesión</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
