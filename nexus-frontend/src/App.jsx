import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard/>} />
         {/* make a route for sign in and a component for sign in and add it here  */}
      </Routes>

    </>
  )
}

export default App

// 1 rem = 16 px 
// 2 rem = 2*16 = 32px