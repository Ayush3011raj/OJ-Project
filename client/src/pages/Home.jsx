import { Link } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
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