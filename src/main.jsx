// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import VistaPrevia from './vistaprevia';
import './index.css';
import './app.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/vista-previa" element={<VistaPrevia />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
