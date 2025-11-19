import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import Post from './pages/Post';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer, toast } from 'react-toastify';
import PassReset from './pages/PassReset';
import UserPublicProfile from './pages/UserPublicProfile';
import ChatList from './pages/ChatList';
import ChatWindow from './pages/ChatWindow';

function App() {

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<PassReset />} />
        <Route path="/public-profile/:username" element={<UserPublicProfile />} />
        <Route path="/chat" element={<ChatList />} />
        <Route path="/chat/:chatId" element={<ChatWindow />} />



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