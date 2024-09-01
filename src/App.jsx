import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider } from 'react-router-dom'
import router from './routes/router'
import Sidebar from './components/Sidebar.component';
import NavBar from './components/Navbar.component';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
    <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    <NavBar toggleSidebar={toggleSidebar} />
    <RouterProvider router={router} />
     </>
  )
}

export default App
