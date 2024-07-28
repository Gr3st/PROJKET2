import './style/App.css';
import UserForm from './components/userForm';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import PanelAdmin from './components/PanelAdmin';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/admin">Panel Admin</Link>
        </nav>
        <Routes>
          <Route path="/" element={<UserForm />} />
          <Route path="/admin" element={<PanelAdmin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
