// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Nav';
import Home from './Components/Home';
import Login from './Components/Login';
import PrivateRoute from './DataBaseConfig/PrivateRoute';
import Logs from './Components/Logs';

const MasterHome = () => {
  return (
    <>
      <Navbar />
      <Home />
    </>
  );
};

const MasterLogs = () => {
  return (
    <>
      <Navbar />
      <Logs />
    </>
  );
};




const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <MasterHome />
            </PrivateRoute>
          }
        />
            <Route
          path="/logs"
          element={
            <PrivateRoute>
              <MasterLogs />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;