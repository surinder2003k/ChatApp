import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <>
    <div className=' '>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Signin/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
        </Routes>
      </BrowserRouter>
    </div>
    </>
  )
}

export default App
