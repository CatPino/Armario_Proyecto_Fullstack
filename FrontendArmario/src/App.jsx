import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom'
import './App.css'
import { Home } from './pages/Home/Home'
import { Contacto } from './pages/Contacto/Contacto'
import { Productos } from './pages/Productos/Productos'
import { Nosotros } from './pages/Nosotros/Nosotros'
import { Blogs } from './pages/Blogs/Blogs'
import { Login } from './pages/Login/Login';
import { Registro } from './pages/Registro/Registro';
import { Navbar } from './componentes/Navbar/Navbar';
import { AdministracionProductos } from './componentes/Admin/AdministracionProductos';
//npm install react-router-dom

function App() {
  

  return (
    <>
     <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/admin/productos" element={<AdministracionProductos />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
