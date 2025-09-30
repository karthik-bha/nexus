import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import Post from './pages/Post';
import PrivateRoute from './components/PrivateRoute'; 

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>}
        />
        <Route
          path="/settings"
          element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>}
        />
        <Route
          path="/profile"
          element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>}
        />
        <Route
          path="/post"
          element={<PrivateRoute><Layout><Post /></Layout></PrivateRoute>}
        />
      </Routes>
    </>
  );
}

export default App;