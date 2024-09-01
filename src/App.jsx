import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider } from 'react-router-dom'
import router from './routes/router'

function App() {

  return (
    <>
    <RouterProvider router={router} />
     </>
  )
}

export default App
