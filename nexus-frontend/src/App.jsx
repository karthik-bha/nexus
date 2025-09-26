import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import Post from './pages/Post';


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/post" element={<Layout><Post /></Layout>} />
      </Routes>

    </>
  )
}

export default App

// 1 rem = 16 px 
// 2 rem = 2*16 = 32px