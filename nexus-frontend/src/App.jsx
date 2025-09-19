import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
         {/* make a route for sign in and a component for sign in and add it here  */}
      </Routes>

    </>
  )
}

export default App

// 1 rem = 16 px 
// 2 rem = 2*16 = 32px