import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom'
import './App.css'
import { Home } from './pages/Home/Home'
import { Contacto } from './pages/Contacto/Contacto'
import { Productos } from './pages/Productos/Productos'
import { Nosotros } from './pages/Nosotros/Nosotros'
import { Blogs } from './pages/Blogs/Blogs'
//npm install react-router-dom

function App() {
  

  return (
    <>
    <Router>
      <Routes>
          <Route path="/" element={< Home />} />
          <Route path="/productos" element={< Productos />} />
          <Route path="/nosotros" element={< Nosotros />} />
          <Route path="/blogs" element={< Blogs />} />
          <Route path="/contacto" element = {< Contacto />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
