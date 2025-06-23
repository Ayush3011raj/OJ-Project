import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../styles/Home.css';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      navigate('/problems');
    }
  }, []);

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to <span className="highlight">Ayushforces</span></h1>
      <p className="home-subtitle">Your Coding Journey Starts Here 🚀</p>
      <div className="home-buttons">
        <Link to="/login"><button className="btn primary">Login</button></Link>
        <Link to="/signup"><button className="btn secondary">Signup</button></Link>
      </div>
    </div>
  );
}
