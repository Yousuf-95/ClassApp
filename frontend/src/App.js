// import logo from './logo.svg';
import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/nav';
import Home from './pages/home';
import LoginPage from './pages/login';
import Dashboard from './pages/dashboard';
import { AuthContext } from './context/authContext';


const RequireAuth = ({ children }) => {
  const authContext = useContext(AuthContext);
  return (
    authContext.authState.isAuthenticated && children
  );
}


function App() {

  return (
    <>
    <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        </Routes>
    </Router>
    </>
  );
}

export default App;
